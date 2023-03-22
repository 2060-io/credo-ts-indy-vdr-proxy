# Aries JavaScript Indy VDR Proxy Server

A server that exposes a REST API to resolve objects in Indy networks. It is built in [NestJs](https://github.com/nestjs/nest) and based on [Aries Framework JavaScript](https://github.com/hyperledger/aries-framework-javascript).

Although it can be used as a general gateway to multiple Indy networks (much in the same way [Universal Resolver](https://dev.uniresolver.io/) does), this server was developed to reduce the workload needed by a mobile application, as multiple ZMQ sockets must be opened when supporting multiple Indy networks and there might be issues in some mobile OS and Mobile Network Operators.

Configuration, such as port and supported networks, are currently hard-coded in `main.ts` and `agent.ts`. Defaults to [BCovrin Test network](http://test.bcovrin.vonx.io/) and port 3000.

### Endpoints

All endpoints use HTTP GET method.

- /did/{fully qualified or legacy Indy did}: resolve a DID Document
- /schema/{fully qualified AnonCreds schema ID}: resolve an AnonCreds Schema
- /credential-definition/{fully qualified AnonCreds credential definition ID}: resolve an AnonCreds Credential Definition
- /revocation-registry-definition/{fully qualified AnonCreds revocation registry definition ID}: resolve an AnonCreds Revocation Registry Definition
- /revocation-status-list/{fully qualified AnonCreds revocation registry definition ID}/{timestamp}: resolve an AnonCreds Revocation Status List

The response for each follows the format used in `@aries-framework/anoncreds` module. It's a JSON containing three elements:

```json
{
  objectTypeInCamelCase: { ... },
  objectTypeInCamelCaseMetadata: { ... };
  resolutionMetadata: { error?: 'invalid' | 'notFound' | 'unsupportedAnonCredsMethod' | string;
    message?: string;};
}
```
