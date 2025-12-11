import type { GetSchemaReturn } from '@credo-ts/anoncreds'
import { Controller, Get, Param } from '@nestjs/common'
import { AgentService } from './agent.service'

interface GetSchemaParams {
  schemaId: string
}

@Controller('schema')
export class SchemaController {
  constructor(private readonly agentService: AgentService) {}

  @Get('/:schemaId')
  public async getSchema(@Param() params: GetSchemaParams): Promise<GetSchemaReturn> {
    const agent = await this.agentService.getAgent()

    const getSchemaReturn = await agent.modules.anoncreds.getSchema(params.schemaId)
    return getSchemaReturn
  }
}
