import { Module } from "@nestjs/common"
import { AgentService } from "./agent.service"
import { CredentialDefinitionController } from "./creddef.controller"
import { DidController } from "./did.controller"
import { RevocationRegistryDefinitionController } from "./revregdef.controller"
import { RevocationStatusListController } from "./revstatuslist.controller"
import { SchemaController } from "./schema.controller"

@Module({
  imports: [],
  controllers: [
    DidController,
    SchemaController,
    CredentialDefinitionController,
    RevocationRegistryDefinitionController,
    RevocationStatusListController,
  ],
  providers: [AgentService],
})
export class AppModule {}
