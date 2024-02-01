import { Agent, ConsoleLogger, DidsModule, Logger, LogLevel } from "@credo-ts/core"
import { agentDependencies } from "@credo-ts/node"
import { AskarModule } from "@credo-ts/askar"
import { AnonCredsModule } from "@credo-ts/anoncreds"
import { IndyVdrAnonCredsRegistry, IndyVdrModule, IndyVdrPoolConfig, IndyVdrSovDidResolver } from "@credo-ts/indy-vdr"
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
      anoncreds,
    }),
    dids: new DidsModule({ resolvers: [new IndyVdrSovDidResolver()] }),
    indyVdr: new IndyVdrModule({
      indyVdr,
      networks,
    }),
  } as const
}
