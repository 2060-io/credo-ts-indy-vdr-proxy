import { type DynamicModule, Module } from '@nestjs/common'
import type { IndyVdrProxyAgent } from './agent'
import { AgentService } from './agent.service'
import { CredentialDefinitionController } from './creddef.controller'
import { DidController } from './did.controller'
import { RevocationRegistryDefinitionController } from './revregdef.controller'
import { RevocationStatusListController } from './revstatuslist.controller'
import { SchemaController } from './schema.controller'

@Module({})
export class IndyVdrProxyModule {
  static register(agent: IndyVdrProxyAgent): DynamicModule {
    return {
      module: IndyVdrProxyModule,
      controllers: [
        DidController,
        SchemaController,
        CredentialDefinitionController,
        RevocationRegistryDefinitionController,
        RevocationStatusListController,
      ],
      providers: [
        {
          provide: 'AGENT',
          useValue: agent,
        },
        AgentService,
      ],
      exports: [AgentService],
    }
  }
}
