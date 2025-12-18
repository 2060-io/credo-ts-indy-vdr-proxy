import { readdirSync } from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')

const packages = readdirSync(path.join(rootDir, 'packages'))

// biome-ignore lint/suspicious/noConsole: ConsoleLogger
console.log(`packages: ${JSON.stringify(packages)}`)
// biome-ignore lint/suspicious/noConsole: ConsoleLogger
console.log(`::set-output name=packages::${JSON.stringify(packages)}`)
