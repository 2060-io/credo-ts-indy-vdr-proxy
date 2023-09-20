import { Controller, Get, Param } from "@nestjs/common"
import { AgentService } from "./agent.service"
import { GetRevocationRegistryDefinitionReturn } from "@aries-framework/anoncreds/build/services/registry"

@Controller("revocation-registry-definition")
export class RevocationRegistryDefinitionController {
  constructor(private readonly agentService: AgentService) {}

  @Get("/:revocationRegistryDefinition")
  public async getRevocationRegistryDefinition(@Param() params): Promise<GetRevocationRegistryDefinitionReturn> {
    const agent = await this.agentService.getAgent()
    const getRevocationRegistryDefinitionReturn = await agent.modules.anoncreds.getRevocationRegistryDefinition(
      params.revocationRegistryDefinition
    )
    return getRevocationRegistryDefinitionReturn
  }
}
