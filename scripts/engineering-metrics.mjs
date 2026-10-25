#!/usr/bin/env node
/**
 * engineering-metrics.mjs — verifiable size/test snapshot of the 0KAY monorepo.
 *
 * Borrowed practice from Tianshu-harness's public engineering-metrics doc: keep a
 * reproducible, checkable view of scale so the numbers in docs can be re-run.
 *
 * Usage (from repo root):  node scripts/engineering-metrics.mjs
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '__pycache__',
  '.venv', 'venv', '.mypy_cache', '.pytest_cache', 'gen', '.logs', '_site', 'data',
]);

/** Modules to measure: label → { dir, exts }. */
const MODULES = {
  core: { dir: 'core', exts: ['.go'] },
  mocr: { dir: 'mocr', exts: ['.go'] },
  obs: { dir: 'obs', exts: ['.go'] },
  life: { dir: 'life', exts: ['.py'] },
  agent: { dir: 'agent/src', exts: ['.ts'] },
  webui: { dir: 'webui/src', exts: ['.ts', '.vue'] },
  'plugin-web': { dir: 'plugin-web', exts: ['.ts', '.vue', '.js'] },
  mcp: { dir: 'mcp/src', exts: ['.ts'] },
  pm: { dir: 'pm/src', exts: ['.mjs', '.js'] },
};

function isTestFile(name) {
  return /\.(test|spec)\.[cm]?[jt]sx?$/.test(name) || /^test_.*\.py$/.test(name) || /_test\.(go|py)$/.test(name);
}

async function walk(dir, exts, acc) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err?.code === 'ENOENT') {
      // A silent zero reads like "measured and empty"; say it is missing.
      console.warn(`engineering-metrics: module dir ${dir} is missing (independent checkout not cloned?) — counted as 0`);
    }
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      await walk(join(dir, entry.name), exts, acc);
      continue;
    }
    const ext = extname(entry.name);
    if (!exts.includes(ext)) continue;
    const path = join(dir, entry.name);
    let text = '';
    try {
      text = await readFile(path, 'utf8');
    } catch {
      continue;
    }
    const lines = text.length ? text.split('\n').length : 0;
    const inTestsDir = /(^|[\\/])(tests?|__tests__)([\\/]|$)/.test(path);
    acc.files += 1;
    acc.lines += lines;
    if (isTestFile(entry.name) || inTestsDir) {
      acc.testFiles += 1;
      acc.testLines += lines;
    }
  }
}

async function main() {
  const rows = [];
  const totals = { files: 0, lines: 0, testFiles: 0, testLines: 0 };
  for (const [label, { dir, exts }] of Object.entries(MODULES)) {
    const acc = { files: 0, lines: 0, testFiles: 0, testLines: 0 };
    await walk(join(ROOT, dir), exts, acc);
    rows.push({ label, ...acc });
    for (const key of Object.keys(totals)) totals[key] += acc[key];
  }

  const pad = (s, n) => String(s).padEnd(n);
  const num = (n) => n.toLocaleString('en-US');

  console.log('# 0KAY engineering metrics');
  console.log(`# generated ${new Date().toISOString()}  (re-run: node scripts/engineering-metrics.mjs)`);
  console.log('');
  console.log(`${pad('module', 14)} ${pad('files', 8)} ${pad('lines', 10)} ${pad('test files', 12)} ${pad('test lines', 10)} ratio`);
  console.log('-'.repeat(64));
  for (const r of rows) {
    const ratio = r.lines ? (r.testLines / r.lines).toFixed(2) : '0.00';
    console.log(`${pad(r.label, 14)} ${pad(num(r.files), 8)} ${pad(num(r.lines), 10)} ${pad(num(r.testFiles), 12)} ${pad(num(r.testLines), 10)} ${ratio}`);
  }
  console.log('-'.repeat(64));
  const ratio = totals.lines ? (totals.testLines / totals.lines).toFixed(2) : '0.00';
  console.log(`${pad('TOTAL', 14)} ${pad(num(totals.files), 8)} ${pad(num(totals.lines), 10)} ${pad(num(totals.testFiles), 12)} ${pad(num(totals.testLines), 10)} ${ratio}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
