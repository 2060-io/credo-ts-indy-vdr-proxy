import type { DidResolutionResult, ParsedDid, DidResolver, AgentContext } from "@aries-framework/core"

export class IndyVdrProxyClientDidResolver implements DidResolver {
  public readonly supportedMethods = ["sov", "indy"]

  private proxyBaseUrl: string

  public constructor(proxyBaseUrl: string) {
    this.proxyBaseUrl = proxyBaseUrl
  }

  public async resolve(agentContext: AgentContext, did: string, _parsed: ParsedDid): Promise<DidResolutionResult> {
    const didDocumentMetadata = {}

    try {
      const response = await agentContext.config.agentDependencies.fetch(`${this.proxyBaseUrl}/did/${did}`)
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
