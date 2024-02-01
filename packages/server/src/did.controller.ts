import { DidResolutionResult } from "@credo-ts/core"
import { Controller, Get, Param } from "@nestjs/common"
import { AgentService } from "./agent.service"

const legacyIndyDidRegex = /^[a-zA-Z0-9]{21,22}$/

@Controller("did")
export class DidController {
  constructor(private readonly agentService: AgentService) {}

  @Get("/:did")
  public async getDid(@Param() params): Promise<DidResolutionResult> {
    const agent = await this.agentService.getAgent()

    const did = params.did.match(legacyIndyDidRegex) ? `did:sov:${params.did}` : params.did
    const didResolutionResult = await agent.dids.resolve(did)
    return didResolutionResult
  }
}
