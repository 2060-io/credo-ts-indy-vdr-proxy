import { randomUUID } from 'node:crypto'
import { AskarModule } from '@credo-ts/askar'
import { Agent } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { askar, KdfMethod } from '@openwallet-foundation/askar-nodejs'

export const agent = new Agent({
  dependencies: agentDependencies,
  modules: {
    askar: new AskarModule({
      store: {
        id: `indy-vdr-proxy-${randomUUID()}`,
        key: askar.storeGenerateRawKey({}),
        keyDerivationMethod: KdfMethod.Raw,
      },
      askar,
    }),
  },
})
