// Discover the running 0kay Core and write devkit/surface.json.
//   node devkit/node/discover.mjs
//   OKAY_CORE_PORT=8080 node devkit/node/discover.mjs
import { createInterface } from 'node:readline/promises'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_PORT, Okay, resolveBaseUrl } from './okay-devkit.mjs'

async function askBaseUrl() {
  if (process.env.OKAY_CORE_PORT || process.env.CORE_HTTP || process.env.CORE_HTTP_ADDR) return resolveBaseUrl()
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    const answer = (await rl.question(`0kay Core port [${DEFAULT_PORT}]: `)).trim()
    return resolveBaseUrl({ port: answer || DEFAULT_PORT })
  } finally {
    rl.close()
  }
}

const baseUrl = await askBaseUrl()
const okay = new Okay({ baseUrl })
const surface = await okay.surface()
surface.generated_at = new Date().toISOString()

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'surface.json')
await writeFile(out, JSON.stringify(surface, null, 2))

console.log(`0kay Core at ${baseUrl}`)
console.log(`  status:  ${surface.health.status}  healthy=${surface.health.healthy} plugins=${surface.health.plugins}`)
console.log(`  plugins: ${surface.plugins.map(p => p.name).join(', ')}`)
console.log(`  settings sections: ${surface.settings_sections.length}`)
console.log(`  wrote ${out}`)
