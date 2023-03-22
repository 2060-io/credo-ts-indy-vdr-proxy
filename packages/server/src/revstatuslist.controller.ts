import { Controller, Get, Param } from "@nestjs/common"
import { AgentService } from "./agent.service"
import { GetRevocationStatusListReturn } from "@aries-framework/anoncreds/build/services/registry"

@Controller("revocation-registry-definition")
export class RevocationStatusListController {
  constructor(private readonly agentService: AgentService) {}

  @Get("/:revocationRegistryDefinition/:timestamp")
  public async getRevocationRegistryDefinition(@Param() params): Promise<GetRevocationStatusListReturn> {
    const agent = await this.agentService.getAgent()

    const getRevocationStatusListReturn = await agent.modules.anoncreds.getRevocationStatusList(
      params.revocationRegistryDefinition,
      params.timestamp
    )
    return getRevocationStatusListReturn
  }
}
