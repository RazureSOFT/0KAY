'use strict';

// The only bridge between the desktop shell and the page.
//
// `windowControl` is what the injected title bar uses; the rest is the small
// surface the page may call. Nothing here hands out filesystem or node access —
// everything that touches the machine stays in the main process.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('okayDesktop', {
  isDesktop: true,
  platform: process.platform,
  status: () => ipcRenderer.invoke('0kay:stack-status'),
  startStack: () => ipcRenderer.invoke('0kay:start-stack'),
  openCompanion: () => ipcRenderer.invoke('0kay:open-companion'),
  // Used by the injected companion chrome (drag bar + close/click-through).
  companion: (action) => ipcRenderer.invoke('0kay:companion', String(action || '')),
  companionMenu: () => ipcRenderer.invoke('0kay:companion-menu'),
  // Window drag from the model body: the page knows the pointer, the main
  // process owns the window position.
  companionDragStart: () => ipcRenderer.send('0kay:companion-drag', 'start'),
  companionDragMove: (x, y) => ipcRenderer.send('0kay:companion-drag', 'move', { x, y }),
  companionDragEnd: () => ipcRenderer.send('0kay:companion-drag', 'end'),
  windowControl: {
    minimize: () => ipcRenderer.invoke('0kay:window', 'minimize'),
    toggleMaximize: () => ipcRenderer.invoke('0kay:window', 'toggle-maximize'),
    close: () => ipcRenderer.invoke('0kay:window', 'close'),
    isMaximized: () => ipcRenderer.invoke('0kay:window', 'is-maximized'),
    // The bar's icon depends on the maximized state, so the main process tells
    // the page when it changes instead of the page guessing.
    onMaximized: (callback) => {
      const listener = (_event, maximized) => callback(!!maximized);
      ipcRenderer.on('0kay:maximized', listener);
      return () => ipcRenderer.removeListener('0kay:maximized', listener);
    },
  },
});
