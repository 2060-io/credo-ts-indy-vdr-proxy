import { type GetRevocationRegistryDefinitionReturn } from '@credo-ts/anoncreds'
import { Controller, Get, Param } from '@nestjs/common'
import { AgentService } from './agent.service'

interface GetRevocationRegistryDefinitionParams {
  revocationRegistryDefinition: string
}

@Controller('revocation-registry-definition')
export class RevocationRegistryDefinitionController {
  constructor(private readonly agentService: AgentService) {}

  @Get('/:revocationRegistryDefinition')
  public async getRevocationRegistryDefinition(
    @Param() params: GetRevocationRegistryDefinitionParams
  ): Promise<GetRevocationRegistryDefinitionReturn> {
    const agent = await this.agentService.getAgent()
    const getRevocationRegistryDefinitionReturn = await agent.modules.anoncreds.getRevocationRegistryDefinition(
      params.revocationRegistryDefinition
    )
    return getRevocationRegistryDefinitionReturn
  }
}
