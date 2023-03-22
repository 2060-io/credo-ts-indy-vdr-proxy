import { Injectable } from "@nestjs/common"
import { IndyVdrProxyAgent, setupAgent } from "./agent"

@Injectable()
export class AgentService {
  private agent: IndyVdrProxyAgent

  public constructor() {
    this.agent = setupAgent()
  }

  async getAgent(): Promise<IndyVdrProxyAgent> {
    if (!this.agent.isInitialized) {
      await this.agent.initialize()
    }

    return this.agent
  }
}
