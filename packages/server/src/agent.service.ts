import { Inject, Injectable } from '@nestjs/common'
import type { IndyVdrProxyAgent } from './agent'

@Injectable()
export class AgentService {
  constructor(@Inject('AGENT') private agent: IndyVdrProxyAgent) {}

  async getAgent(): Promise<IndyVdrProxyAgent> {
    if (!this.agent.isInitialized) {
      await this.agent.initialize()
    }

    return this.agent
  }
}
