import { Controller, Get, Param } from "@nestjs/common"
import { AgentService } from "./agent.service"
import { GetCredentialDefinitionReturn } from "@credo-ts/anoncreds/build/services/registry"

interface GetCredentialDefinitionParams {
  credentialDefinitionId: string
}

@Controller("credential-definition")
export class CredentialDefinitionController {
  constructor(private readonly agentService: AgentService) {}

  @Get("/:credentialDefinitionId")
  public async getCredentialDefinition(
    @Param() params: GetCredentialDefinitionParams
  ): Promise<GetCredentialDefinitionReturn> {
    const agent = await this.agentService.getAgent()

    const getCredentialDefinitionReturn = await agent.modules.anoncreds.getCredentialDefinition(
      params.credentialDefinitionId
    )
    return getCredentialDefinitionReturn
  }
}
