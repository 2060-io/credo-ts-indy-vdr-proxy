import { readdirSync } from 'fs'
import path from 'path'

const packages = readdirSync(path.join(__dirname, '..', 'packages'))

// biome-ignore lint/suspicious/noConsole: ConsoleLogger
console.log(`packages: ${JSON.stringify(packages)}`)
// biome-ignore lint/suspicious/noConsole: ConsoleLogger
console.log(`::set-output name=packages::${JSON.stringify(packages)}`)
