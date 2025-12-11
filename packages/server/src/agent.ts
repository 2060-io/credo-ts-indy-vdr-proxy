import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import { askar } from '@openwallet-foundation/askar-nodejs'

import { AnonCredsModule } from '@credo-ts/anoncreds'
import { AskarModule } from '@credo-ts/askar'
import { Agent, ConsoleLogger, DidsModule, type Logger, LogLevel } from '@credo-ts/core'
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  type IndyVdrPoolConfig,
  IndyVdrSovDidResolver,
} from '@credo-ts/indy-vdr'
import { agentDependencies } from '@credo-ts/node'

export type IndyVdrProxyAgent = Agent<ReturnType<typeof getIndyVdrProxyAgentModules>>

export function setupAgent(options: { networks: [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]; logger?: Logger }) {
  return new Agent({
    config: {
      autoUpdateStorageOnStartup: true,
      logger: options.logger ?? new ConsoleLogger(LogLevel.debug),
    },
    dependencies: agentDependencies,
    modules: getIndyVdrProxyAgentModules(options.networks),
  })
}

const getIndyVdrProxyAgentModules = (networks: [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]) => {
  return {
    askar: new AskarModule({
      askar,
      store: {
        id: 'indy-vdr-proxy',
        key: 'indy-vdr-proxy',
      },
    }),
    anoncreds: new AnonCredsModule({
      registries: [new IndyVdrAnonCredsRegistry()],
      anoncreds,
    }),
    dids: new DidsModule({ resolvers: [new IndyVdrSovDidResolver(), new IndyVdrIndyDidResolver()] }),
    indyVdr: new IndyVdrModule({
      indyVdr,
      networks,
    }),
  } as const
}
