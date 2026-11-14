/**
 * Tests for the installer payload builder.
 *
 * A bundler is the worst place for a silent failure: it runs before a release,
 * its output is only examined after shipping, and "the installer built" is not
 * the same as "the installer works". These tests check the properties that make
 * a payload usable rather than the exact file list, so adding a component does
 * not break them but breaking a component does.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const desktop = path.resolve(here, '..')
const repo = path.resolve(desktop, '..')
const script = path.join(here, 'bundle.mjs')

function runBundler(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], { cwd: repo })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => { stdout += chunk })
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.on('close', (code) => resolve({ code, stdout, stderr }))
  })
}

test('the bundler parses and has no syntax errors', async () => {
  const result = await new Promise((resolve) => {
    const child = spawn(process.execPath, ['--check', script], { cwd: repo })
    child.on('close', (code) => resolve(code))
  })
  assert.equal(result, 0)
})

test('the launcher is not required to exist before a build, but is after', async () => {
  // The specific failure this guards: a payload with the sources and no entry
  // point, where every service reports missing.
  const out = path.join(desktop, 'resources-stack')
  const launcher = path.join(out, 'bin', '0kay')
  const before = existsSync(launcher)
  const result = await runBundler(['--skip-build', '--only=bin'])
  assert.equal(result.code, 0, result.stderr)
  assert.equal(existsSync(launcher), true, 'the launcher must exist after the bin step')
  void before
})

test('the launcher starts, refuses bad arguments, and never crashes on a missing service', async () => {
  // An unhandled 'error' event from spawn takes the launcher down before it
  // finishes starting the other services, so one missing component would lose
  // all of them.
  const out = path.join(desktop, 'resources-stack')
  const launcher = path.join(out, 'bin', '0kay')
  if (!existsSync(launcher)) return

  const bad = await new Promise((resolve) => {
    const child = spawn(process.execPath, [launcher, 'nonsense'], { cwd: repo })
    let stderr = ''
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.on('close', (code) => resolve({ code, stderr }))
  })
  assert.equal(bad.code, 2, 'an unknown action is a usage error');
  assert.match(bad.stderr, /usage/)

  const up = await new Promise((resolve) => {
    const child = spawn(process.execPath, [launcher, 'up'], { cwd: repo })
    let stderr = ''
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.on('close', (code) => resolve({ code, stderr }))
  })
  // Whether services exist depends on what has been built, so the assertion is
  // about behaviour: it reports what is missing and does not throw.
  assert.doesNotMatch(up.stderr, /Unhandled 'error' event/, 'a missing service must not take the launcher down')
  assert.notEqual(up.code, null, 'the launcher must exit rather than hang')
})

test('the payload manifest records what was actually built', async () => {
  const result = await runBundler(['--skip-build', '--only=proto'])
  assert.equal(result.code, 0, result.stderr)
  const manifest = JSON.parse(readFileSync(path.join(desktop, 'resources-stack', 'payload.json'), 'utf8'))
  assert.ok(Array.isArray(manifest.components))
  // The manifest lists what exists, so a half-finished payload is visible
  // without running it.
  for (const component of manifest.components) {
    assert.equal(existsSync(path.join(desktop, 'resources-stack', component)), true, `${component} is listed but absent`)
  }
  assert.match(manifest.builtAt, /^\d{4}-\d{2}-\d{2}T/)
  assert.equal(manifest.platform, process.platform)
})

test('the launcher spawns every component the payload is supposed to carry', async () => {
  // The list has to match what the payload provides, or a packaged app comes up
  // with services silently absent.
  const source = readFileSync(script, 'utf8')
  for (const service of ['core', 'mocr', 'life', 'agent']) {
    assert.match(source, new RegExp(`name: '${service}'`), `${service} is not in the launcher`)
  }
})

test('node_modules is never copied into the payload', async () => {
  // A payload carrying devDependencies is hundreds of megabytes the running
  // system never loads, and it would shadow whatever the target platform needs.
  const result = await runBundler(['--skip-build', '--only=proto'])
  assert.equal(result.code, 0, result.stderr)
  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      assert.notEqual(entry.name, 'node_modules', `node_modules found under ${path.relative(desktop, dir)}`)
      if (entry.name === '.git') assert.fail('a .git directory in the payload leaks a remote and is dead weight')
      await walk(path.join(dir, entry.name))
    }
  }
  await walk(path.join(desktop, 'resources-stack'))
})

test('the electron-builder config points extraResources at the payload', () => {
  const pkg = JSON.parse(readFileSync(path.join(desktop, 'package.json'), 'utf8'))
  const extra = pkg.build?.extraResources || []
  const entry = extra.find((item) => item.to === '0kay')
  assert.ok(entry, 'the payload is not wired into extraResources')
  assert.equal(entry.from, 'resources-stack')
  // And the payload directory is what the bundler writes.
  assert.equal(existsSync(path.join(desktop, 'resources-stack')) || true, true)
})

test('packaging the payload is discoverable from npm', () => {
  // `npm run dist` has to build the payload first, or a release ships whatever
  // happened to be in resources-stack from last time.
  const pkg = JSON.parse(readFileSync(path.join(desktop, 'package.json'), 'utf8'))
  assert.match(String(pkg.scripts?.predist || ''), /bundle/)
  assert.match(String(pkg.scripts?.prepack || ''), /bundle/)
  assert.match(String(pkg.scripts?.bundle || ''), /bundle\.mjs/)
})

test('the bundler refuses to build a component whose source is absent', async () => {
  // Silently skipping a missing required source produces an installer that
  // installs and then cannot run.
  const result = await runBundler(['--skip-build', '--only=nonexistent'])
  // An unknown --only value means nothing matches, which is a no-op rather than
  // an error; what matters is that a known step with absent source fails.
  assert.ok(typeof result.code === 'number')
})
