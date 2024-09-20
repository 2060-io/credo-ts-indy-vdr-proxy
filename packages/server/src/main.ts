import { IndyVdrPoolConfig } from "@credo-ts/indy-vdr"
import { NestFactory } from "@nestjs/core"
import { setupAgent } from "./agent"
import { IndyVdrProxyModule } from "./app.module"

import { readFileSync } from "fs"
import { Logger } from "@nestjs/common"
import { ConsoleLogger } from "@credo-ts/core"

async function bootstrap() {
  const configPath = process.env.INDY_VDR_PROXY_CONFIG_PATH ?? "./res/app.config.json"
  const config = JSON.parse(readFileSync(configPath, { encoding: "utf-8" }))
  const logger = new ConsoleLogger(config.logLevel)
  logger.info(`Bootstrapping Indy VDR Proxy Server with config file ${configPath}`)
  const networks = config.networks as [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]

  const agent = setupAgent({ networks, logger })
  await agent.initialize()
  logger.info("Agent initialized")

  const app = await NestFactory.create(IndyVdrProxyModule.register(agent))
  await app.listen(config.port ?? 3000)
}
bootstrap().catch((e) => {
  Logger.error("Error initializing server", e)
})
