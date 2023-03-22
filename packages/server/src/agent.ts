import { Agent, ConsoleLogger, DidsModule, Logger, LogLevel } from "@aries-framework/core"
import { agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"
import { AnonCredsModule } from "@aries-framework/anoncreds"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrModule,
  IndyVdrPoolConfig,
  IndyVdrSovDidResolver,
} from "@aries-framework/indy-vdr"
import { anoncreds } from "@hyperledger/anoncreds-nodejs"
import { ariesAskar } from "@hyperledger/aries-askar-nodejs"
import { indyVdr } from "@hyperledger/indy-vdr-nodejs"

export type IndyVdrProxyAgent = Agent<ReturnType<typeof getIndyVdrProxyAgentModules>>

export function setupAgent(options: { networks: [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]; logger?: Logger }) {
  return new Agent({
    config: {
      label: "Indy VDR Proxy",
      walletConfig: {
        id: "indy-vdr-proxy",
        key: "indy-vdr-proxy",
      },
      logger: options.logger ?? new ConsoleLogger(LogLevel.off),
    },
    dependencies: agentDependencies,
    modules: getIndyVdrProxyAgentModules(options.networks),
  })
}

const getIndyVdrProxyAgentModules = (networks: [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]) => {
  return {
    askar: new AskarModule({ ariesAskar }),
    anoncreds: new AnonCredsModule({
      registries: [new IndyVdrAnonCredsRegistry()],
    }),
    anoncredsRs: new AnonCredsRsModule({ anoncreds }),
    dids: new DidsModule({ resolvers: [new IndyVdrSovDidResolver()] }),
    indyVdr: new IndyVdrModule({
      indyVdr,
      networks,
    }),
  } as const
}
