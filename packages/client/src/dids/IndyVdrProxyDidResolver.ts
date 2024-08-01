import type { Headers } from "../types"
import type { DidResolutionResult, ParsedDid, DidResolver, AgentContext } from "@credo-ts/core"

export class IndyVdrProxyDidResolver implements DidResolver {
  public readonly supportedMethods = ["sov", "indy"]

  public readonly allowsCaching = true

  private proxyBaseUrl: string
  private _headers?: Headers

  private async getHeaders(): Promise<Record<string, string> | undefined> {
    if (typeof this._headers === "function") {
      return await Promise.resolve(this._headers())
    }

    return this._headers
  }

  public constructor(options: { proxyBaseUrl: string; headers?: Headers }) {
    this.proxyBaseUrl = options.proxyBaseUrl
    this._headers = options.headers
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async resolve(agentContext: AgentContext, did: string, _parsed: ParsedDid): Promise<DidResolutionResult> {
    const didDocumentMetadata = {}

    try {
      const response = await agentContext.config.agentDependencies.fetch(
        `${this.proxyBaseUrl}/did/${encodeURIComponent(did)}`,
        {
          method: "GET",
          headers: await this.getHeaders(),
        }
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
