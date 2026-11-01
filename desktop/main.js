'use strict';

// Desktop shell for 0KAY.
//
// The WebUI already runs in a browser, so the shell does three things a browser
// cannot: start the stack if it is not up, keep the companion in a window that
// floats above other apps, and stay in the tray so closing the window does not
// kill the running stack.
//
// Plain CommonJS on purpose: this file must be readable and debuggable without a
// build step, and `node --check` has to pass on a machine with no node_modules.

const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

let electron = {};
try {
  electron = require('electron');
} catch (error) {
  // Running under plain node (`node desktop/main.js`) is a mistake worth naming,
  // not a stack trace about a missing native module.
  if (require.main === module) {
    console.error('This is the Electron entry point. Run `npm start` inside desktop/, or `npx electron desktop/`.');
    process.exit(2);
  }
}

const { app, BrowserWindow, Menu, Tray, shell, nativeImage, ipcMain, Notification, screen } = electron;

// Packaged builds keep the whole stack (binaries, webui, agent, node runtime)
// under Resources/0kay. A source checkout uses the repository itself.
function stackRoot() {
  if (process.env.OKAY_HOME) return path.resolve(process.env.OKAY_HOME);
  if (app && app.isPackaged && process.resourcesPath) {
    return path.join(process.resourcesPath, '0kay');
  }
  return ROOT;
}

function runtimePort(root) {
  for (const relative of ['runtime-env.json', path.join('data', 'runtime-env.json')]) {
    try {
      const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
      if (value && value.CORE_HTTP_PORT) return String(value.CORE_HTTP_PORT);
    } catch (error) {
      // No runtime env yet: the installer or the bundled launcher writes it on
      // first start, and until then the default port is the right guess.
    }
  }
  return '';
}

const STACK_ROOT = stackRoot();
const LOGS_DIR = path.join(STACK_ROOT, 'data', 'logs');
const DEFAULT_URL = process.env.CORE_HTTP_ADDR || `http://127.0.0.1:${runtimePort(STACK_ROOT) || 8080}`;
const CORE_URL = DEFAULT_URL.replace(/\/$/, '');

/** @type {BrowserWindow | null} */
let mainWindow = null;
/** @type {BrowserWindow | null} */
let companionWindow = null;
/** Remembered position so the pet comes back where it was left. */
/**
 * Where and how big the pet window was left.
 *
 * Persisted: a window you drag once should come back there, and "centred" has to
 * be a state the app can return to rather than whatever happened on first launch.
 */
let companionBounds = { width: 450, height: 600 };

/** Desktop-side preferences. Owned by the app, not by Core, so they work offline. */
const prefsPath = () => path.join(app.getPath('userData'), 'prefs.json');
let prefs = { petEnabled: false, petCentered: true };
function loadPrefs() {
  try {
    const raw = JSON.parse(fs.readFileSync(prefsPath(), 'utf8'));
    prefs = { ...prefs, ...(raw && typeof raw === 'object' ? raw : {}) };
  } catch { /* first run */ }
  return prefs;
}
function savePrefs(patch) {
  prefs = { ...prefs, ...patch };
  try {
    fs.mkdirSync(path.dirname(prefsPath()), { recursive: true });
    fs.writeFileSync(prefsPath(), JSON.stringify(prefs, null, 2));
  } catch { /* a read-only profile must not break the app */ }
  return prefs;
}
/** Bottom-centre of the work area: visible without covering the middle of the screen. */
function centeredPetBounds(width, height) {
  const { workArea } = screen.getPrimaryDisplay();
  return {
    width,
    height,
    x: Math.round(workArea.x + (workArea.width - width) / 2),
    y: Math.round(workArea.y + workArea.height - height - 24),
  };
}
/** @type {Tray | null} */
let tray = null;
let stackProcess = null;

// Core serves the API and the plugin assets. In a source checkout the page
// itself comes from the WebUI dev server, so the window has to look for a UI
// instead of assuming Core's root is the app.
const UI_CANDIDATES = [
  process.env.WEBUI_URL || '',
  'http://127.0.0.1:3000',
  CORE_URL,
].filter(Boolean);

function isHtmlUrl(url) {
  return String(url || '').startsWith('http');
}

/** The first candidate that actually serves the page, or '' if none does. */
async function resolveUiUrl(candidates = UI_CANDIDATES) {
  for (const candidate of candidates) {
    const base = String(candidate).replace(/\/$/, '');
    if (!isHtmlUrl(base)) continue;
    try {
      const response = await fetch(`${base}/`, { signal: AbortSignal.timeout(1500) });
      const type = response.headers.get('content-type') || '';
      if (response.ok && type.includes('text/html')) return base;
    } catch (error) {
      // Not this one.
    }
  }
  return '';
}

let uiBase = '';

// The title bar is a page-context script; read it once and inject it into the
// main window only (the floating companion window has no frame by design).
const ICON_MARK = (() => {
  try {
    const bytes = fs.readFileSync(path.join(__dirname, 'assets', 'mark.png'));
    return `data:image/png;base64,${bytes.toString('base64')}`;
  } catch (error) {
    return '';
  }
})();

const companionChromeCode = (() => {
  try {
    return fs.readFileSync(path.join(__dirname, 'companion-chrome.js'), 'utf8');
  } catch (error) {
    return '';
  }
})();

const titlebarCode = (() => {
  try {
    // The bar is injected into a page served from another origin, so the icon
    // travels with the code instead of as a file it would have to fetch.
    return fs.readFileSync(path.join(__dirname, 'titlebar.js'), 'utf8')
      .replace('__OKAY_ICON__', ICON_MARK);
  } catch (error) {
    console.warn('titlebar.js not found; the window will have no title bar');
    return '';
  }
})();

/** Frameless window controls, called from the injected bar through preload. */
function handleWindowControl(action) {
  if (!mainWindow) return { ok: false, reason: 'no window' };
  switch (action) {
    case 'minimize':
      mainWindow.minimize();
      return { ok: true };
    case 'toggle-maximize':
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      else mainWindow.maximize();
      return { ok: true, maximized: mainWindow.isMaximized() };
    case 'close':
      mainWindow.close();
      return { ok: true };
    case 'is-maximized':
      return { ok: true, maximized: mainWindow.isMaximized() };
    case 'show':
      // Settings lives in its own window; bringing the main one back must also
      // restore it from the tray, not just focus it.
      if (!mainWindow.isVisible()) mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      return { ok: true };
    default:
      return { ok: false, reason: `unknown action ${action}` };
  }
}

async function stackIsUpAt(url) {
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/health`, { signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function stackIsUp() {
  return stackIsUpAt(CORE_URL);
}

function stackEntry() {
  // A packaged build runs the bundled supervisor; a source checkout reuses the
  // launcher that already knows the ports, the .env and the plugin handshake.
  const bundled = path.join(STACK_ROOT, 'bin', process.platform === 'win32' ? '0kay.exe' : '0kay');
  const candidates = [
    bundled,
    path.join(ROOT, '.run', process.platform === 'win32' ? 'launch.cmd' : 'launch.sh'),
    path.join(ROOT, 'start-0kay.sh'),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || '';
}

function stackCommand(entry, action) {
  const name = path.basename(entry).toLowerCase();
  if (name === '0kay' || name === '0kay.exe') return { command: entry, args: [action] };
  if (entry.endsWith('.sh')) return { command: 'bash', args: [entry, action === 'up' ? 'start' : 'stop'] };
  return { command: entry, args: [] };
}

function startStack() {
  if (stackProcess) return { started: false, reason: 'already starting' };
  const entry = stackEntry();
  if (!entry) return { started: false, reason: 'no launcher found' };
  const { command, args } = stackCommand(entry, 'up');
  stackProcess = spawn(command, args, { cwd: STACK_ROOT, detached: true, stdio: 'ignore' });
  stackProcess.on('exit', () => { stackProcess = null; });
  stackProcess.unref();
  return { started: true, entry };
}

function stopStack() {
  const entry = stackEntry();
  if (!entry) return { stopped: false, reason: 'no launcher found' };
  const { command, args } = stackCommand(entry, 'down');
  try {
    const child = spawn(command, args, { cwd: STACK_ROOT, detached: true, stdio: 'ignore' });
    child.unref();
  } catch (error) {
    return { stopped: false, reason: error.message };
  }
  return { stopped: true, entry };
}

function waitForStackAt(url, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve) => {
    const tick = async () => {
      if (await stackIsUpAt(url)) return resolve(true);
      if (Date.now() > deadline) return resolve(false);
      setTimeout(tick, 250);
    };
    tick();
  });
}

function waitForStack(timeoutMs = 90000) {
  return waitForStackAt(CORE_URL, timeoutMs);
}

/** `--shot=<file>` renders one frame and exits; used to check the shell renders. */
function shotTarget() {
  const arg = process.argv.find((value) => String(value).startsWith('--shot='));
  return arg ? arg.slice('--shot='.length) : '';
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f1216',
    title: '0KAY',
    // No OS frame: the title bar is drawn by titlebar.js, so it matches the app
    // instead of the desktop theme. The button handlers live in the main process.
    frame: false,
    titleBarStyle: 'hidden',
    // Dev builds take the taskbar icon from here; a packaged build uses the exe.
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL(uiBase);
  mainWindow.webContents.on('did-fail-load', (_event, code, description, url) => {
    // A blank window with no message is the worst possible failure mode.
    console.error(`failed to load ${url}: ${description} (${code})`);
  });
  const injectTitlebar = () => {
    if (titlebarCode) {
      mainWindow.webContents.executeJavaScript(titlebarCode, true)
        .catch((error) => console.error('titlebar injection failed:', error.message));
    }
  };
  mainWindow.webContents.on('did-finish-load', injectTitlebar);
  // The page can also be re-rendered or navigated inside the SPA; the bar is
  // fixed-position so it survives, but a full load recreates it.
  mainWindow.on('maximize', () => mainWindow?.webContents.send('0kay:maximized', true));
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('0kay:maximized', false));

  const shotPath = shotTarget();
  if (shotPath) {
    mainWindow.webContents.once('did-finish-load', async () => {
      // Give the SPA a moment to mount before grabbing the frame.
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        // Text first: a PNG that is only a colour tells you nothing, but the
        // visible text says whether the page actually mounted.
        const probe = await mainWindow.webContents.executeJavaScript(`(async () => JSON.stringify({
          title: document.title,
          url: location.href,
          text: (document.body.innerText || "").slice(0, 120),
          titlebar: !!document.getElementById('okay-titlebar'),
          titlebarButtons: document.querySelectorAll('#okay-titlebar button').length,
          appTopPadding: (() => { const app = document.getElementById('app'); return app ? getComputedStyle(app).paddingTop : ''; })(),
          bridge: typeof window.okayDesktop?.windowControl?.toggleMaximize === 'function',
          platform: window.okayDesktop?.platform || '',
          maximized: window.okayDesktop ? (await window.okayDesktop.windowControl.isMaximized()).maximized : null,
          // A data URI that failed to decode is drawn as an empty box, so check
          // the decoded size rather than the tag's presence.
          markLoaded: (() => { const img = document.querySelector('#okay-titlebar .okay-mark'); return img ? (img.complete + '/' + img.naturalWidth + 'x' + img.naturalHeight) : 'missing'; })(),
        }))()`);
        console.log('page:', probe);
        const image = await mainWindow.webContents.capturePage();
        fs.writeFileSync(shotPath, image.toPNG());
        console.log(`captured ${shotPath} ${image.getSize().width}x${image.getSize().height}`);
      } catch (error) {
        console.error('capture failed:', error.message);
      }
      app.isQuitting = true;
      app.quit();
    });
  }
  // External links belong in the browser; a chat window should not become one.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(uiBase)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      // The first close looks like a quit to anyone who has not used a tray app.
      if (!toldAboutTray) {
        toldAboutTray = true;
        notify('0KAY is still running', 'It is in the tray. Quit from the tray menu to stop it.');
      }
    }
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

let companionClickThrough = false;

function createCompanionWindow() {
  if (companionWindow) {
    companionWindow.showInactive();
    return companionWindow;
  }
  companionWindow = new BrowserWindow({
    // Sizes and flags follow the reference desktop pet: a 450x600 stage, no frame,
    // no shadow, transparent, and shown only once it has painted.
    width: companionBounds.width || 450,
    height: companionBounds.height || 600,
    frame: false,
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
    transparent: true,
    // Windows keeps the window opaque unless the background colour is explicitly
    // transparent as well; `transparent: true` alone is not enough on some builds.
    backgroundColor: '#00000000',
    resizable: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    roundedCorners: false,
    // Nothing is shown until the model has painted, which avoids a white flash.
    show: false,
    // Remember where the user dragged her last time; centre her the first time.
    ...(Number.isFinite(companionBounds.x) && Number.isFinite(companionBounds.y)
      ? { x: companionBounds.x, y: companionBounds.y }
      : centeredPetBounds(companionBounds.width || 450, companionBounds.height || 600)),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // Level "floating" keeps her above normal windows without covering menus and
  // system dialogs the way "screen-saver" would.
  // 'screen-saver' keeps her above other always-on-top windows; 'floating' gets
  // buried by them.
  companionWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  // The app router uses createWebHistory, not hash history: `#/companion` would
  // simply load the main page and ignore the fragment.
  // /pet renders only the Live2D stage on a transparent page; /companion would
  // load the whole settings panel into a 420px floating window.
  companionWindow.loadURL(`${uiBase}/pet`);
  companionWindow.setMenuBarVisibility(false);
  companionWindow.once('ready-to-show', () => {
    companionWindow?.showInactive();
  });
  const injectChrome = () => {
    if (companionChromeCode) {
      companionWindow?.webContents.executeJavaScript(companionChromeCode, true)
        .catch((error) => console.error('companion chrome injection failed:', error.message));
    }
  };
  companionWindow.webContents.on('did-finish-load', injectChrome);

  const saveBounds = () => {
    if (!companionWindow) return;
    const [x, y] = companionWindow.getPosition();
    const [width, height] = companionWindow.getSize();
    companionBounds = { x, y, width, height };
  };
  companionWindow.on('moved', saveBounds);
  companionWindow.on('resized', saveBounds);
  companionWindow.on('closed', () => {
    // Dropping the reference is what lets the tray item create a fresh one; the
    // old behaviour left a stale handle and "show" on a destroyed window threw.
    companionWindow = null;
    syncTrayMenu();
  });
  syncTrayMenu();
  return companionWindow;
}

/** Hide (not destroy) so the model keeps its WebGL context and position. */
function hideCompanionWindow() {
  companionWindow?.hide();
  syncTrayMenu();
}

function closeCompanionWindow() {
  if (!companionWindow) return;
  companionWindow.destroy();
  companionWindow = null;
  syncTrayMenu();
}

/** Let clicks through to whatever is behind her, for when she covers a window. */
function setCompanionClickThrough(enabled) {
  companionClickThrough = !!enabled;
  companionWindow?.setIgnoreMouseEvents(companionClickThrough, { forward: true });
  syncTrayMenu();
}

/**
 * Tell the user something happened.
 *
 * The shell can act without a window — starting the stack, hiding to the tray —
 * and doing that silently is what makes it feel broken. Falls back to the tray
 * balloon, and to the console when neither is available.
 */
function notify(title, body) {
  try {
    if (Notification.isSupported()) {
      new Notification({ title, body, silent: false }).show();
      return;
    }
  } catch (error) {
    // fall through
  }
  try {
    tray?.displayBalloon({ title, content: body });
  } catch (error) {
    console.log(`[${title}] ${body}`);
  }
}

let toldAboutTray = false;

function focusMain() {
  if (!mainWindow) createMainWindow();
  mainWindow.show();
  mainWindow.focus();
}

/** Rebuild the tray menu so its checkboxes reflect the live state. */
let preferencesWindow = null;

/**
 * The app's own settings window.
 *
 * The pet switch used to live only in the tray, which is findable when you already
 * know it is there and invisible otherwise. A separate window also keeps the
 * setting where people look for settings.
 */
function openPreferences() {
  if (preferencesWindow && !preferencesWindow.isDestroyed()) {
    preferencesWindow.focus();
    return preferencesWindow;
  }
  preferencesWindow = new BrowserWindow({
    width: 460,
    height: 400,
    resizable: false,
    minimizable: false,
    maximizable: false,
    title: '0KAY 设置',
    parent: mainWindow || undefined,
    show: false,
    backgroundColor: '#faf9fd',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  preferencesWindow.setMenuBarVisibility(false);
  preferencesWindow.loadFile(path.join(__dirname, 'preferences.html'));
  preferencesWindow.once('ready-to-show', () => preferencesWindow?.show());
  preferencesWindow.on('closed', () => { preferencesWindow = null; });
  return preferencesWindow;
}

function centerCompanionWindow() {
  if (!companionWindow || companionWindow.isDestroyed()) return false;
  const [width, height] = companionWindow.getSize();
  const target = centeredPetBounds(width, height);
  companionWindow.setPosition(target.x, target.y);
  companionBounds = { ...companionBounds, ...target };
  savePrefs({ petCentered: true, companionBounds });
  return true;
}

/** Show or hide from the app itself: the tray is a shortcut, not the only way in. */
function applyPetEnabled(enabled) {
  savePrefs({ petEnabled: !!enabled });
  if (enabled) {
    createCompanionWindow();
  } else {
    hideCompanionWindow();
  }
  syncTrayMenu();
  return !!enabled;
}

function syncTrayMenu() {
  if (!tray || tray.isDestroyed()) return;
  const petVisible = !!companionWindow && companionWindow.isVisible();
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open 0KAY', click: focusMain },
    { label: '设置…', click: () => openPreferences() },
    { type: 'separator' },
    {
      label: petVisible ? 'Hide companion window' : 'Show companion window',
      click: () => { petVisible ? hideCompanionWindow() : createCompanionWindow(); },
    },
    {
      label: 'Companion click-through',
      type: 'checkbox',
      checked: companionClickThrough,
      enabled: petVisible,
      click: (item) => setCompanionClickThrough(item.checked),
    },
    {
      label: 'Close companion window',
      enabled: !!companionWindow,
      click: () => closeCompanionWindow(),
    },
    { type: 'separator' },
    {
      label: 'Restart stack',
      click: async () => {
        stopStack();
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const result = startStack();
        if (!result.started) {
          notify('Could not start the stack', result.reason || 'no launcher found');
          return;
        }
        notify('Starting 0KAY', `Launched ${path.basename(result.entry)}`);
        const up = await waitForStack();
        notify(up ? '0KAY is up' : '0KAY did not come up',
               up ? `Core answered at ${CORE_URL}` : `No answer from ${CORE_URL} — check the logs folder`);
      },
    },
    {
      label: 'Stop 0KAY stack',
      click: () => {
        const result = stopStack();
        notify(result.stopped ? 'Stopping 0KAY' : 'Could not stop 0KAY', result.reason || '');
      },
    },
    {
      label: 'Open logs folder',
      click: async () => {
        const logs = fs.existsSync(LOGS_DIR) ? LOGS_DIR : path.join(ROOT, '.logs');
        const failed = await shell.openPath(logs);
        if (failed) notify('Could not open the logs folder', failed);
      },
    },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } },
  ]));
}

function buildTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
  if (icon.isEmpty()) {
    // A Tray with an empty image throws on Windows, and losing the whole shell
    // because a decorative file is missing is not a trade worth making.
    console.warn('desktop/assets/tray.png is missing; running without a tray icon');
    return;
  }
  try {
    tray = new Tray(icon);
  } catch (error) {
    console.warn('could not create the tray icon:', error.message);
    return;
  }
  tray.setToolTip('0KAY');
  tray.setContextMenu(Menu.buildFromTemplate([{ label: 'Loading…', enabled: false }]));
  syncTrayMenu();
  tray.on('click', focusMain);
}

async function boot() {
  loadPrefs();
  if (prefs.companionBounds) companionBounds = { ...companionBounds, ...prefs.companionBounds };
  if (!(await stackIsUp())) {
    startStack();
    const ready = await waitForStack();
    if (!ready) {
      // Still open the window: the WebUI shows its own connection error, which
      // is more informative than an empty shell with a dialog.
      console.warn('0KAY stack did not answer /health within the timeout');
    }
  }
  uiBase = await resolveUiUrl();
  if (!uiBase) {
    console.warn("no WebUI answered; expected WEBUI_URL, :3000 or Core's root");
    uiBase = CORE_URL;
  }
  createMainWindow();
  buildTray();
  // The pet is a preference, so it comes back on its own after a restart instead
  // of being a thing you re-enable every launch.
  if (prefs.petEnabled) createCompanionWindow();
}

if (app) {
  // Without an AppUserModelID Windows silently drops notifications.
  if (process.platform === 'win32') app.setAppUserModelId('dev.0kay.desktop');

  // Hardware acceleration stays ON by default: Pixi's WebGL stage (the Live2D
  // model) needs it, and turning it off to chase black gradient artefacts broke
  // wheel-zoom on the model while the artefacts stayed. Software compositing is
  // available as an escape hatch for machines where the GPU path is worse.
  if (process.env.OKAY_DESKTOP_SOFTWARE_GPU === '1') {
    app.disableHardwareAcceleration();
  }
  // A capture run is a second process on purpose; the single-instance lock is
  // for the interactive app, not for `--shot`.
  const gotLock = shotTarget() ? true : app.requestSingleInstanceLock();
  if (!gotLock) {
    app.quit();
  } else {
    app.on('second-instance', focusMain);
    app.whenReady().then(boot);
    app.on('activate', () => { if (!mainWindow) createMainWindow(); });
    // Closing the last window keeps the stack running; quitting is explicit.
    app.on('window-all-closed', () => {});
    ipcMain.handle('0kay:stack-status', async () => ({ up: await stackIsUp(), ui: uiBase, core: CORE_URL }));
    ipcMain.handle('0kay:window', (_event, action) => handleWindowControl(String(action || '')));
    ipcMain.handle('0kay:start-stack', () => startStack());
    ipcMain.handle('0kay:open-companion', () => { createCompanionWindow(); return true; });
    ipcMain.handle('0kay:prefs', () => ({
      ...prefs,
      petVisible: !!companionWindow && companionWindow.isVisible(),
      bounds: companionBounds,
    }));
    ipcMain.handle('0kay:prefs-set', (_event, patch) => {
      const next = patch && typeof patch === 'object' ? patch : {};
      if (typeof next.petEnabled === 'boolean') applyPetEnabled(next.petEnabled);
      if (next.centerPet === true) centerCompanionWindow();
      return { ...prefs, petVisible: !!companionWindow && companionWindow.isVisible() };
    });
    ipcMain.handle('0kay:open-settings', () => { openPreferences(); return true; });
    ipcMain.on('0kay:companion-drag', (_event, phase, point) => {
      if (!companionWindow || companionWindow.isDestroyed()) return;
      if (phase === 'move' && point) {
        companionWindow.setPosition(Math.round(point.x), Math.round(point.y));
      } else if (phase === 'end') {
        const [x, y] = companionWindow.getPosition();
        const [width, height] = companionWindow.getSize();
        companionBounds = { x, y, width, height };
        // Dragging away from the centre is a state, not an accident: keep it.
        savePrefs({ companionBounds, petCentered: false });
      }
    });
    ipcMain.handle('0kay:companion-menu', () => {
      if (!companionWindow) return false;
      Menu.buildFromTemplate([
        { label: 'Open 0KAY', click: focusMain },
        { type: 'separator' },
        { label: 'Hide', click: () => hideCompanionWindow() },
        {
          label: 'Click-through',
          type: 'checkbox',
          checked: companionClickThrough,
          click: (item) => setCompanionClickThrough(item.checked),
        },
        { type: 'separator' },
        { label: 'Close', click: () => closeCompanionWindow() },
      ]).popup({ window: companionWindow });
      return true;
    });
    ipcMain.handle('0kay:companion', (_event, action) => {
      const what = String(action || '');
      if (what === 'show') createCompanionWindow();
      else if (what === 'hide') hideCompanionWindow();
      else if (what === 'close') closeCompanionWindow();
      else if (what === 'click-through') setCompanionClickThrough(!companionClickThrough);
      else return { ok: false, reason: `unknown action ${what}` };
      return { ok: true, visible: !!companionWindow && companionWindow.isVisible() };
    });
  }
}

module.exports = {
  stackIsUp, stackIsUpAt, stackEntry, stackCommand, startStack, stopStack,
  waitForStack, waitForStackAt, resolveUiUrl, CORE_URL, STACK_ROOT,
};
