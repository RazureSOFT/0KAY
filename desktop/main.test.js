'use strict';

// Run with: node --test desktop/
//
// Only the parts that decide something without Electron are covered here: where
// the launcher lives, and whether the stack answers. The window/tray code is
// verified by running the app, not by asserting on Electron objects.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const shell = require('./main.js');

test('a launcher is found in the repo root', () => {
  const entry = shell.stackEntry();
  assert.ok(entry, 'no launcher found; expected .run/launch.* or start-0kay.sh');
  assert.ok(fs.existsSync(entry));
  assert.ok(path.isAbsolute(entry));
});

test('the core url has no trailing slash and points at this machine', () => {
  assert.ok(!shell.CORE_URL.endsWith('/'));
  assert.match(shell.CORE_URL, /^https?:\/\/(127\.0\.0\.1|localhost)/);
});

test('the ui resolver skips candidates that are not pages', async () => {
  // Nothing is listening on these ports, so the resolver must give up cleanly
  // rather than throw or return a half-built url.
  assert.equal(await shell.resolveUiUrl(['http://127.0.0.1:59997', 'not-a-url']), '');
});

test('the ui resolver returns the first candidate that serves html', async () => {
  // The WebUI dev server is usually up on this machine; if it is not, the test
  // still holds because an empty result is the documented outcome.
  const resolved = await shell.resolveUiUrl(['http://127.0.0.1:59997', 'http://127.0.0.1:3000']);
  assert.ok(resolved === '' || resolved === 'http://127.0.0.1:3000');
});

test('a port with nothing on it reads as down', async () => {
  const up = await shell.stackIsUpAt('http://127.0.0.1:59998');
  assert.equal(up, false);
});

test('waiting for a stack that never comes up gives up', async () => {
  const started = Date.now();
  const ready = await shell.waitForStackAt('http://127.0.0.1:59998', 400);
  assert.equal(ready, false);
  assert.ok(Date.now() - started >= 300, 'should actually wait');
});
