import { Controller, Get, Param } from "@nestjs/common"
import { AgentService } from "./agent.service"
import { GetRevocationStatusListReturn } from "@credo-ts/anoncreds/build/services/registry"

interface GetRevocationStatusListParams {
  revocationRegistryDefinition: string
  timestamp: number
}

@Controller("revocation-status-list")
export class RevocationStatusListController {
  constructor(private readonly agentService: AgentService) {}

  @Get("/:revocationRegistryDefinition/:timestamp")
  public async getRevocationRegistryDefinition(
    @Param() params: GetRevocationStatusListParams
  ): Promise<GetRevocationStatusListReturn> {
    const agent = await this.agentService.getAgent()

    const getRevocationStatusListReturn = await agent.modules.anoncreds.getRevocationStatusList(
      params.revocationRegistryDefinition,
      params.timestamp
    )
    return getRevocationStatusListReturn
  }
}
