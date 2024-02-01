import type { DidResolutionResult, ParsedDid, DidResolver, AgentContext } from "@credo-ts/core"

export class IndyVdrProxyDidResolver implements DidResolver {
  public readonly supportedMethods = ["sov", "indy"]

  public readonly allowsCaching = true

  private proxyBaseUrl: string

  public constructor(proxyBaseUrl: string) {
    this.proxyBaseUrl = proxyBaseUrl
  }

  public async resolve(agentContext: AgentContext, did: string, _parsed: ParsedDid): Promise<DidResolutionResult> {
    const didDocumentMetadata = {}

    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/did/${encodeURIComponent(did)}`
      )
      if (!response.ok) {
        return {
          didDocument: null,
          didDocumentMetadata,
          didResolutionMetadata: {
            error: "failed",
            message: `resolver_error: Unable to resolve did '${did}': server status ${response.status}`,
          },
        }
      }
      return (await response.json()) as DidResolutionResult
    } catch (error) {
      return {
        didDocument: null,
        didDocumentMetadata,
        didResolutionMetadata: {
          error: "notFound",
          message: `resolver_error: Unable to resolve did '${did}': ${error}`,
        },
      }
    }
  }
}
