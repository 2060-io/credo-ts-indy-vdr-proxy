import type {
  AnonCredsRegistry,
  GetCredentialDefinitionReturn,
  GetSchemaReturn,
  RegisterSchemaOptions,
  RegisterCredentialDefinitionOptions,
  RegisterSchemaReturn,
  RegisterCredentialDefinitionReturn,
  GetRevocationStatusListReturn,
  GetRevocationRegistryDefinitionReturn,
} from "@aries-framework/anoncreds"
import type { AgentContext } from "@aries-framework/core"

import { indyVdrAnonCredsRegistryIdentifierRegex } from "./identifiers"

export class IndyVdrAnonCredsRegistry implements AnonCredsRegistry {
  public readonly supportedIdentifier = indyVdrAnonCredsRegistryIdentifierRegex

  private proxyBaseUrl: string

  public constructor(proxyBaseUrl: string) {
    this.proxyBaseUrl = proxyBaseUrl
  }
  public async getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn> {
    try {
      const response = await agentContext.config.agentDependencies.fetch(`${this.proxyBaseUrl}/schema/${schemaId}`)

      return (await response.json()) as GetSchemaReturn
    } catch (error) {
      agentContext.config.logger.error(`Error retrieving schema '${schemaId}'`, {
        error,
        schemaId,
      })

      return {
        schemaId,
        resolutionMetadata: {
          error: "notFound",
        },
        schemaMetadata: {},
      }
    }
  }

  public async registerSchema(
    agentContext: AgentContext,
    options: RegisterSchemaOptions
  ): Promise<RegisterSchemaReturn> {
    return {
      schemaMetadata: {},
      registrationMetadata: {},
      schemaState: {
        state: "failed",
        schema: options.schema,
        reason: "IndyVdrProxy does not support registration",
      },
    }
  }

  public async getCredentialDefinition(
    agentContext: AgentContext,
    credentialDefinitionId: string
  ): Promise<GetCredentialDefinitionReturn> {
    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/credential-definition/${credentialDefinitionId}`
      )

      return (await response.json()) as GetCredentialDefinitionReturn
    } catch (error) {
      agentContext.config.logger.error(`Error retrieving credential definition '${credentialDefinitionId}'`, {
        error,
        credentialDefinitionId,
      })

      return {
        credentialDefinitionId,
        credentialDefinitionMetadata: {},
        resolutionMetadata: {
          error: "notFound",
          message: `unable to resolve credential definition: ${error.message}`,
        },
      }
    }
  }

  public async registerCredentialDefinition(
    agentContext: AgentContext,
    options: RegisterCredentialDefinitionOptions
  ): Promise<RegisterCredentialDefinitionReturn> {
    return {
      credentialDefinitionMetadata: {},
      registrationMetadata: {},
      credentialDefinitionState: {
        state: "failed",
        credentialDefinition: options.credentialDefinition,
        reason: "IndyVdrProxy does not support registration",
      },
    }
  }

  public async getRevocationRegistryDefinition(
    agentContext: AgentContext,
    revocationRegistryDefinitionId: string
  ): Promise<GetRevocationRegistryDefinitionReturn> {
    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/revocation-registry-definition/${revocationRegistryDefinitionId}`
      )
      return (await response.json()) as GetRevocationRegistryDefinitionReturn
    } catch (error) {
      agentContext.config.logger.error(
        `Error retrieving revocation registry definition '${revocationRegistryDefinitionId}' from ledger`,
        {
          error,
          revocationRegistryDefinitionId,
        }
      )

      return {
        resolutionMetadata: {
          error: "notFound",
          message: `unable to resolve revocation registry definition: ${error.message}`,
        },
        revocationRegistryDefinitionId,
        revocationRegistryDefinitionMetadata: {},
      }
    }
  }

  public async getRevocationStatusList(
    agentContext: AgentContext,
    revocationRegistryId: string,
    timestamp: number
  ): Promise<GetRevocationStatusListReturn> {
    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/revocation-status-list/${revocationRegistryId}/${timestamp}`
      )
      return (await response.json()) as GetRevocationStatusListReturn
    } catch (error) {
      agentContext.config.logger.error(
        // eslint-disable-next-line max-len
        `Error retrieving revocation registry delta '${revocationRegistryId}' from ledger, potentially revocation interval ends before revocation registry creation?"`,
        {
          error,
          revocationRegistryId: revocationRegistryId,
        }
      )

      return {
        resolutionMetadata: {
          error: "notFound",
          // eslint-disable-next-line max-len
          message: `Error retrieving revocation registry delta '${revocationRegistryId}' from ledger, potentially revocation interval ends before revocation registry creation: ${error.message}`,
        },
        revocationStatusListMetadata: {},
      }
    }
  }
}
