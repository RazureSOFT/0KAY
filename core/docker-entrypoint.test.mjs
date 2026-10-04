import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

test('container seeds fresh UI, refreshes builtins, and preserves custom data', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'okay-ui-test-'))
  const seed = path.join(root, 'seed')
  const data = path.join(root, 'data')
  try {
    await mkdir(path.join(seed, 'plugin-ui/webui'), { recursive: true })
    await mkdir(path.join(seed, 'ui'), { recursive: true })
    await writeFile(path.join(seed, 'plugin-ui/webui/chat.js'), 'v1')
    await writeFile(path.join(seed, 'ui/platform.patch'), 'shipped')
    const shell = process.env.TEST_SH || 'sh'
    const run = () => execFileSync(shell, ['docker-entrypoint.sh', 'true'], {
      env: { ...process.env, CORE_DATA_DIR: data, CORE_UI_SEED_DIR: seed },
    })
    run()
    assert.equal(await readFile(path.join(data, 'plugin-ui/webui/chat.js'), 'utf8'), 'v1')
    await writeFile(path.join(data, 'ui/platform.patch'), 'owner edits')
    await mkdir(path.join(data, 'plugin-ui/custom'))
    await writeFile(path.join(data, 'plugin-ui/custom/index.js'), 'custom')
    await writeFile(path.join(seed, 'plugin-ui/webui/chat.js'), 'v2')
    run()
    assert.equal(await readFile(path.join(data, 'plugin-ui/webui/chat.js'), 'utf8'), 'v2')
    assert.equal(await readFile(path.join(data, 'ui/platform.patch'), 'utf8'), 'owner edits')
    assert.equal(await readFile(path.join(data, 'plugin-ui/custom/index.js'), 'utf8'), 'custom')
  } finally { await rm(root, { recursive: true, force: true }) }
})
