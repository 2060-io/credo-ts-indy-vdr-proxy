import { IndyVdrPoolConfig } from "@aries-framework/indy-vdr"
import { NestFactory } from "@nestjs/core"
import { setupAgent } from "./agent"
import { IndyVdrProxyModule } from "./app.module"

import { readFileSync } from "fs"
import { Logger } from "@nestjs/common"
import { ConsoleLogger } from "@aries-framework/core"

async function bootstrap() {
  const configPath = process.env.INDY_VDR_PROXY_CONFIG_PATH ?? "./res/app.config.json"
  Logger.debug(`Bootstrapping Indy VDR Proxy Server with config file ${configPath}`)
  const config = JSON.parse(readFileSync(configPath, { encoding: "utf-8" }))

  const networks = config.networks as [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]

  const app = await NestFactory.create(
    IndyVdrProxyModule.register(setupAgent({ networks, logger: new ConsoleLogger(config.logLevel) }))
  )
  await app.listen(config.port ?? 3000)
}
bootstrap()
