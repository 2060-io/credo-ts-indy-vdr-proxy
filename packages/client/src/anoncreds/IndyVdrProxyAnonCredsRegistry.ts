import type { Headers } from "../types"
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
  RegisterRevocationRegistryDefinitionReturn,
  RegisterRevocationStatusListReturn,
} from "@credo-ts/anoncreds"

import { CacheModuleConfig, type AgentContext } from "@credo-ts/core"

import { indyVdrAnonCredsRegistryIdentifierRegex } from "./identifiers"

export interface CacheSettings {
  allowCaching: boolean
  cacheDurationInSeconds: number
}

export class IndyVdrProxyAnonCredsRegistry implements AnonCredsRegistry {
  public readonly methodName = "indy"

  public readonly supportedIdentifier = indyVdrAnonCredsRegistryIdentifierRegex

  private proxyBaseUrl: string

  private cacheSettings: CacheSettings

  private _headers?: Headers

  private get headers(): Record<string, string> | undefined {
    if (typeof this._headers === "function") {
      return this._headers()
    }

    return this._headers
  }

  public constructor(options: { proxyBaseUrl: string; cacheOptions?: CacheSettings; headers?: Headers }) {
    const { proxyBaseUrl, cacheOptions, headers } = options
    this.proxyBaseUrl = proxyBaseUrl
    this._headers = headers

    this.cacheSettings = cacheOptions ?? { allowCaching: true, cacheDurationInSeconds: 300 }
  }

  public async getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn> {
    const cacheKey = `anoncreds:schema:${schemaId}`

    if (this.cacheSettings.allowCaching) {
      const cache = agentContext.dependencyManager.resolve(CacheModuleConfig).cache

      const cachedObject = await cache.get<GetSchemaReturn>(agentContext, cacheKey)

      if (cachedObject) {
        return {
          schema: cachedObject.schema,
          schemaId,
          schemaMetadata: cachedObject.schemaMetadata,
          resolutionMetadata: {
            ...cachedObject.resolutionMetadata,
            servedFromCache: true,
          },
        }
      }
    }

    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/schema/${encodeURIComponent(schemaId)}`,
        {
          method: "GET",
          headers: this.headers,
        }
      )
      if (!response.ok) {
        return {
          schemaId,
          resolutionMetadata: {
            error: "failed",
            message: `server status code: ${response.status}`,
          },
          schemaMetadata: {},
        }
      }
      const result = (await response.json()) as GetSchemaReturn
      if (result.schema && this.cacheSettings.allowCaching) {
        const cache = agentContext.dependencyManager.resolve(CacheModuleConfig).cache
        await cache.set(
          agentContext,
          cacheKey,
          {
            resolutionMetadata: result.resolutionMetadata,
            schema: result.schema,
            schemaMetadata: result.schemaMetadata,
          },
          this.cacheSettings.cacheDurationInSeconds
        )
      }

      return result
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
    const cacheKey = `anoncreds:credentialDefinition:${credentialDefinitionId}`

    if (this.cacheSettings.allowCaching) {
      const cache = agentContext.dependencyManager.resolve(CacheModuleConfig).cache

      const cachedObject = await cache.get<GetCredentialDefinitionReturn>(agentContext, cacheKey)

      if (cachedObject) {
        return {
          credentialDefinition: cachedObject.credentialDefinition,
          credentialDefinitionId,
          credentialDefinitionMetadata: cachedObject.credentialDefinitionMetadata,
          resolutionMetadata: {
            ...cachedObject.resolutionMetadata,
            servedFromCache: true,
          },
        }
      }
    }

    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/credential-definition/${encodeURIComponent(credentialDefinitionId)}`,
        {
          method: "GET",
          headers: this.headers,
        }
      )

      if (!response.ok) {
        return {
          credentialDefinitionId,
          resolutionMetadata: {
            error: "failed",
            message: `server status code: ${response.status}`,
          },
          credentialDefinitionMetadata: {},
        }
      }
      const result = (await response.json()) as GetCredentialDefinitionReturn

      if (result.credentialDefinition && this.cacheSettings.allowCaching) {
        const cache = agentContext.dependencyManager.resolve(CacheModuleConfig).cache
        await cache.set(
          agentContext,
          cacheKey,
          {
            resolutionMetadata: result.resolutionMetadata,
            credentialDefinition: result.credentialDefinition,
            credentialDefinitionMetadata: result.credentialDefinitionMetadata,
          },
          this.cacheSettings.cacheDurationInSeconds
        )
      }

      return result
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
    const cacheKey = `anoncreds:revocationRegistryDefinition:${revocationRegistryDefinitionId}`

    if (this.cacheSettings.allowCaching) {
      const cache = agentContext.dependencyManager.resolve(CacheModuleConfig).cache

      const cachedObject = await cache.get<GetRevocationRegistryDefinitionReturn>(agentContext, cacheKey)

      if (cachedObject) {
        return {
          revocationRegistryDefinition: cachedObject.revocationRegistryDefinition,
          revocationRegistryDefinitionId,
          revocationRegistryDefinitionMetadata: cachedObject.revocationRegistryDefinitionMetadata,
          resolutionMetadata: {
            ...cachedObject.resolutionMetadata,
            servedFromCache: true,
          },
        }
      }
    }

    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/revocation-registry-definition/${encodeURIComponent(revocationRegistryDefinitionId)}`,
        {
          method: "GET",
          headers: this.headers,
        }
      )
      if (!response.ok) {
        return {
          revocationRegistryDefinitionId,
          resolutionMetadata: {
            error: "failed",
            message: `server status code: ${response.status}`,
          },
          revocationRegistryDefinitionMetadata: {},
        }
      }

      const result = (await response.json()) as GetRevocationRegistryDefinitionReturn

      if (result.revocationRegistryDefinition && this.cacheSettings.allowCaching) {
        const cache = agentContext.dependencyManager.resolve(CacheModuleConfig).cache
        await cache.set(
          agentContext,
          cacheKey,
          {
            resolutionMetadata: result.resolutionMetadata,
            revocationRegistryDefinition: result.revocationRegistryDefinition,
            revocationRegistryDefinitionMetadata: result.revocationRegistryDefinitionMetadata,
          },
          this.cacheSettings.cacheDurationInSeconds
        )
      }

      return result
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

  public async registerRevocationRegistryDefinition(): Promise<RegisterRevocationRegistryDefinitionReturn> {
    return {
      registrationMetadata: {},
      revocationRegistryDefinitionMetadata: {},
      revocationRegistryDefinitionState: {
        state: "failed",
        reason: "IndyVdrProxy does not support registration",
      },
    }
  }

  public async getRevocationStatusList(
    agentContext: AgentContext,
    revocationRegistryId: string,
    timestamp: number
  ): Promise<GetRevocationStatusListReturn> {
    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/revocation-status-list/${encodeURIComponent(revocationRegistryId)}/${timestamp}`,
        {
          method: "GET",
          headers: this.headers,
        }
      )
      if (!response.ok) {
        return {
          resolutionMetadata: {
            error: "failed",
            message: `server status code: ${response.status}`,
          },
          revocationStatusListMetadata: {},
        }
      }

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

  public async registerRevocationStatusList(): Promise<RegisterRevocationStatusListReturn> {
    return {
      registrationMetadata: {},
      revocationStatusListMetadata: {},
      revocationStatusListState: {
        state: "failed",
        reason: "IndyVdrProxy does not support registration",
      },
    }
  }
}
