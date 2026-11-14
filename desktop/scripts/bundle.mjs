#!/usr/bin/env node
/**
 * Build the desktop installer's payload from source.
 *
 * electron-builder expects the whole stack to sit at `desktop/resources-stack`,
 * and that directory was never in the repository — it was assembled by hand
 * before a release, which means the installer could only be built by whoever
 * remembered the steps. This builds it from the checkout.
 *
 * What has to be in the payload, and why:
 *
 *   bin/0kay        the launcher the app spawns. Its absence is why a packaged
 *                   build fell back to `start-0kay.sh` and then to nothing.
 *   core/           the Go binary. Compiled here, not copied from a previous
 *                   build: a stale binary in an installer is a bug that ships.
 *   webui/dist      the interface Core serves. Built, because the checked-in
 *                   sources are not what runs.
 *   plugin-ui/      the plugin pages, same reason.
 *   life/           the Python plugin, with its virtualenv. The venv is
 *                   platform-specific, so it cannot be shipped from CI — it is
 *                   built here.
 *   agent/          the Node plugin, with its production dependencies only.
 *   mocr/           the other Go plugin.
 *   proto/          the gRPC contracts every plugin loads at start.
 *
 * What is deliberately NOT in the payload: the reference checkouts, the tests,
 * and any source the running system does not read. An installer is not a
 * tarball of the repository.
 *
 * Every step is idempotent and skippable, so a release engineer can rebuild one
 * piece without rebuilding the stack.
 */

import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
// scripts/ lives under desktop/, so the repository root is two levels up. The
// desktop package directory is one.
const desktop = path.resolve(here, '..')
const repo = path.resolve(desktop, '..')
const out = path.join(desktop, 'resources-stack')

const args = new Set(process.argv.slice(2))
const only = [...args].filter((arg) => arg.startsWith('--only=')).map((arg) => arg.slice(7))
const skipBuild = args.has('--skip-build')
const isWindows = process.platform === 'win32'

function log(message) {
  process.stderr.write(`[bundle] ${message}\n`)
}

/**
 * Run a command.
 *
 * `shell` is deliberately false for everything: with a shell, the argument
 * array is re-split by cmd.exe, so `-ldflags`, `-s -w` arrives as three
 * arguments and Go reports "flag provided but not defined: -w". Passing the
 * array straight to spawn is what keeps an argument an argument.
 *
 * A Windows batch file cannot be spawned without a shell, so `npm` and `npx`
 * — which are `.cmd` shims — are the one exception, resolved to their script.
 */
function run(command, argv, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, argv, {
      cwd: options.cwd || repo,
      stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
      shell: false,
      env: { ...process.env, ...(options.env || {}) },
    })
    let stdout = ''
    let stderr = ''
    child.stdout?.on('data', (chunk) => { stdout += chunk })
    child.stderr?.on('data', (chunk) => { stderr += chunk })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) return resolve(stdout)
      reject(new Error(`${command} ${argv.join(' ')} exited ${code}\n${stdout}\n${stderr}`))
    })
  })
}

/** Run an npm subcommand. npm is a .cmd shim on Windows, so it needs a shell. */
function runNpm(argv, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(isWindows ? 'npm.cmd' : 'npm', argv, {
      cwd,
      stdio: 'inherit',
      shell: true,
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) return resolve()
      reject(new Error(`npm ${argv.join(' ')} exited ${code}`))
    })
  })
}

async function copyDir(from, to, options = {}) {
  if (!existsSync(from)) {
    if (options.required) throw new Error(`missing source: ${from}`)
    log(`skip (absent): ${path.relative(repo, from)}`)
    return 0
  }
  await fs.cp(from, to, {
    recursive: true,
    force: true,
    filter: (src) => {
      const rel = path.relative(from, src).replace(/\\/g, '/')
      if (!rel) return true
      const parts = rel.split('/')
      if (parts.some((part) => ['node_modules', '.git', '__pycache__'].includes(part))) {
        // node_modules is rebuilt, not copied; a .git anywhere in a payload is
        // both dead weight and a way to leak a remote.
        return false
      }
      if (options.exclude?.some((pattern) => pattern.test(rel))) return false
      return true
    },
  })
  return 1
}

/** Should this step run? `--only=` narrows it; no flag means all of them. */
function wanted(step) {
  return only.length === 0 || only.includes(step)
}

async function clean() {
  // Only what this script owns. A blanket rm of the parent would delete the
  // developer's own build output.
  await fs.rm(path.join(out, 'bin'), { recursive: true, force: true })
  await fs.rm(path.join(out, 'core'), { recursive: true, force: true })
  await fs.rm(path.join(out, 'mocr'), { recursive: true, force: true })
  await fs.rm(path.join(out, 'webui'), { recursive: true, force: true })
  await fs.rm(path.join(out, 'agent'), { recursive: true, force: true })
  await fs.rm(path.join(out, 'life'), { recursive: true, force: true })
  await fs.rm(path.join(out, 'proto'), { recursive: true, force: true })
  await fs.mkdir(out, { recursive: true })
}

/** The Go binaries: core and mocr. */
async function buildGo(step, dir, binary) {
  // The name is spelled out rather than left to the toolchain: Go appends `.exe`
  // only when `-o` names a directory, and a payload whose binary is `core` while
  // the launcher looks for `core.exe` reports a component it actually has as
  // missing. The launcher resolves the same pair, so the two agree by
  // construction rather than by memory.
  const target = path.join(out, step, isWindows ? `${binary}.exe` : binary)
  await fs.mkdir(path.dirname(target), { recursive: true })
  if (skipBuild) {
    log(`skip build ${step} (--skip-build)`)
    return
  }
  log(`building ${step} → ${path.relative(repo, target)}`)
  await run('go', ['build', '-trimpath', '-ldflags', '-s -w', '-o', target, './cmd/' + binary], {
    cwd: path.join(repo, dir),
    stdio: 'inherit',
  })
}

/** The interface Core serves: the shell and the plugin pages. */
async function buildWebui() {
  if (skipBuild) {
    log('skip webui build (--skip-build)')
    return
  }
  log('building webui (npm run build)')
  await runNpm(['run', 'build'], path.join(repo, 'webui'))
  log('building plugin pages (npm run build:plugin)')
  await runNpm(['run', 'build:plugin'], path.join(repo, 'webui'))
}

/**
 * The Node plugin, with production dependencies only.
 *
 * `npm ci --omit=dev` in the copy rather than copying the developer's
 * node_modules: a payload carrying devDependencies is several hundred megabytes
 * of tests and type definitions that the running system never loads.
 */
async function buildAgent() {
  const target = path.join(out, 'agent')
  await copyDir(path.join(repo, 'agent'), target, {
    required: true,
    exclude: [/^dist\//, /^data\//, /\.test\.ts$/, /^tsconfig\.json$/],
  })
  if (skipBuild) {
    log('skip agent build (--skip-build)')
    return
  }
  log('installing agent production dependencies')
  await runNpm(['ci', '--omit=dev', '--no-audit', '--no-fund'], target)
  // The launcher spawns `dist/index.js`, which the package's own `build` script
  // produces. Without this step the payload has the sources and no entry point,
  // and the launcher reports every service missing.
  log('building the agent entry point')
  await runNpm(['run', 'build'], target)
}

/** The Python plugin, with a virtualenv built on this machine. */
async function buildLife() {
  const target = path.join(out, 'life')
  await copyDir(path.join(repo, 'life'), target, {
    required: true,
    exclude: [/^tests?\//, /^\.venv\//, /\.pyc$/],
  })
  if (skipBuild) {
    log('skip life build (--skip-build)')
    return
  }
  const python = isWindows ? 'python' : 'python3'
  log('creating the life virtualenv')
  await run(python, ['-m', 'venv', path.join(target, '.venv')], { cwd: target, stdio: 'inherit' })
  const venvPython = isWindows
    ? path.join(target, '.venv', 'Scripts', 'python.exe')
    : path.join(target, '.venv', 'bin', 'python')
  // The plugin's own requirements, not a hard-coded list: a hand-maintained list
  // is a dependency that gets added in the repository and forgotten here.
  const requirements = path.join(target, 'requirements.txt')
  if (existsSync(requirements)) {
    await run(venvPython, ['-m', 'pip', 'install', '--no-input', '-r', requirements], { cwd: target, stdio: 'inherit' })
  } else {
    log('no requirements.txt; the venv has only the standard library')
  }
}

/**
 * The launcher the app spawns.
 *
 * A small Node program rather than a shell script: `0kay.exe` on Windows would
 * need a compiler and a signature, and the app only needs something it can spawn
 * with a start/stop argument.
 */
async function writeLauncher() {
  const dir = path.join(out, 'bin')
  await fs.mkdir(dir, { recursive: true })
  const launcher = `#!/usr/bin/env node
// Start or stop the bundled stack. Generated by desktop/scripts/bundle.mjs.
//
// Deliberately does not import anything from the repository: the payload is the
// whole world at this point, and a require() into a path that does not exist in
// the installer is how a packaged app dies at launch with a stack trace nobody
// can read.
const { spawn } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')

const ROOT = path.resolve(__dirname, '..')
const action = process.argv[2] || 'up'
const isWindows = process.platform === 'win32'

const entry = (relative) => path.join(ROOT, ...relative.split('/'))

/**
 * The executable for a component.
 *
 * A Go build with -o core/core writes core/core, not core/core.exe, even on
 * Windows — the extension is only added by the toolchain when -o names a
 * directory. So both spellings are tried rather than assuming the platform one:
 * assuming it reported every service as missing in a payload that had them.
 */
function firstExisting(candidates) {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return candidates[0]
}

const goBinary = (dir, name) => firstExisting([
  entry(dir + '/' + name + (isWindows ? '.exe' : '')),
  entry(dir + '/' + name),
])

const services = [
  { name: 'core', cwd: 'core', command: goBinary('core', 'core'), args: [], port: 8080 },
  { name: 'mocr', cwd: 'mocr', command: goBinary('mocr', 'mocr'), args: [], port: 50051 },
  {
    name: 'life',
    cwd: 'life',
    command: entry('life/.venv/' + (isWindows ? 'Scripts/python.exe' : 'bin/python')),
    args: ['-m', 'life.main'],
    port: 50053,
  },
  // The agent runs on the Node that ships with the app, not on a dist entry that
  // may not have been built; dist/index.js is preferred and reported missing
  // when absent rather than silently skipped.
  {
    name: 'agent',
    cwd: 'agent',
    command: process.execPath,
    args: [entry('agent/dist/index.js')],
    port: 50054,
    require: entry('agent/dist/index.js'),
  },
]

if (action === 'stop') {
  // Nothing to stop: every service is a child of this process, and the app kills
  // the process group. Saying so beats a silent success.
  process.stdout.write('stack children are stopped with this process\\n')
  process.exit(0)
}

if (action !== 'up') {
  process.stderr.write('usage: 0kay [up|stop]\\n')
  process.exit(2)
}

let started = 0
for (const service of services) {
  // A service is present when what it actually runs exists. For the agent the
  // executable is Node itself, which always exists, so checking the command would
  // claim a service that has no entry point.
  const needed = service.require || service.command
  if (!fs.existsSync(needed)) {
    process.stderr.write('[0kay] ' + service.name + ' is missing at ' + needed + '\\n')
    continue
  }
  if (service.require && !fs.existsSync(service.command)) {
    process.stderr.write('[0kay] ' + service.name + ' has no runtime at ' + service.command + '\\n')
    continue
  }
  const child = spawn(service.command, service.args, {
    cwd: path.join(ROOT, service.cwd),
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, CORE_HTTP_ADDR: 'http://127.0.0.1:8080', CORE_WEBUI_DIR: entry('webui/dist') },
  })
  // A spawn failure is asynchronous, and an unhandled 'error' event takes the
  // launcher down before it finishes starting the other services — so a missing
  // agent would also lose core and mocr, and the app would look broken rather
  // than partially built.
  child.on('error', (error) => {
    process.stderr.write('[0kay] ' + service.name + ' failed to start: ' + error.message + '\\n')
  })
  child.unref()
  started += 1
}

if (!started) {
  process.stderr.write('[0kay] no service could be started\\n')
  process.exit(1)
}
process.stdout.write('[0kay] started ' + started + ' service(s)\\n')
`
  const target = path.join(dir, '0kay')
  await fs.writeFile(target, launcher, 'utf8')
  await fs.chmod(target, 0o755).catch(() => undefined)
  // Windows spawn needs an executable extension; the app looks for `0kay.exe`.
  if (isWindows) await fs.writeFile(path.join(dir, '0kay.exe.cmd'), `@echo off\r\n"${process.execPath}" "%~dp00kay" %*\r\n`, 'utf8')
  log(`wrote launcher ${path.relative(repo, target)}`)
}

async function main() {
  log(`payload → ${path.relative(repo, out)}`)
  if (!args.has('--no-clean')) await clean()

  if (wanted('core')) await buildGo('core', 'core', 'core')
  if (wanted('mocr')) await buildGo('mocr', 'mocr', 'mocr')
  if (wanted('webui')) {
    await buildWebui()
    await copyDir(path.join(repo, 'webui', 'dist'), path.join(out, 'webui', 'dist'), { required: true })
    await copyDir(path.join(repo, 'core', 'data', 'plugin-ui'), path.join(out, 'webui', 'plugin-ui'), { required: true })
  }
  if (wanted('agent')) await buildAgent()
  if (wanted('life')) await buildLife()
  if (wanted('proto')) await copyDir(path.join(repo, 'proto'), path.join(out, 'proto'), { required: true })
  if (wanted('bin')) await writeLauncher()

  // A manifest of what was built, so a release can be told apart from a
  // half-finished payload without running it.
  const manifest = {
    builtAt: new Date().toISOString(),
    platform: process.platform,
    arch: process.arch,
    version: JSON.parse(readFileSync(path.join(desktop, 'package.json'), 'utf8')).version,
    components: ['core', 'mocr', 'webui', 'agent', 'life', 'proto', 'bin'].filter((name) => existsSync(path.join(out, name))),
  }
  await fs.writeFile(path.join(out, 'payload.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  log(`done: ${manifest.components.join(', ')}`)
}

main().catch((error) => {
  process.stderr.write(`[bundle] failed: ${error.message}\n`)
  process.exit(1)
})
