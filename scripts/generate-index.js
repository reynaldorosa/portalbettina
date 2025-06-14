#! /usr/bin/env node
// Generate barrel index.js files for all subdirectories in src
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateIndex(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  // Filter .js files excluding index.js
  const files = entries.filter((e) => e.isFile() && e.name.endsWith('.js') && e.name !== 'index.js')
  // Filter subdirectories
  const dirs = entries.filter((e) => e.isDirectory())

  const exports = []

  for (const file of files) {
    const name = path.basename(file.name, '.js')
    exports.push(`export * from './${name}.js';`)
  }
  for (const d of dirs) {
    // ensure nested index exists
    exports.push(`export * from './${d.name}/index.js';`)
  }

  if (exports.length > 0) {
    // Remove duplicate export lines
    const uniqueExports = Array.from(new Set(exports))
    const content = ['// Auto-generated barrel file', ...uniqueExports].join('\n') + '\n'
    const indexPath = path.join(dir, 'index.js')
    await fs.writeFile(indexPath, content, 'utf8')
    console.log(`Generated index.js in ${dir}`)
  }

  for (const d of dirs) {
    await generateIndex(path.join(dir, d.name))
  }
}

;(async () => {
  try {
    const root = path.resolve(__dirname, '..', 'src')
    await generateIndex(root)
  } catch (err) {
    console.error('Error generating indexes:', err)
    process.exit(1)
  }
})()
