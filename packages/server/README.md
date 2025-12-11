# Credo Indy VDR Proxy Server

A server that exposes a REST API to resolve objects in Indy networks. It is built in [NestJs](https://github.com/nestjs/nest) and based on [Credo](https://github.com/openwallet-foundation/credo-ts).

Although it can be used as a general gateway to multiple Indy networks (much in the same way [Universal Resolver](https://dev.uniresolver.io/) does), this server was developed to reduce the workload needed by a mobile application, as multiple ZMQ sockets must be opened when supporting multiple Indy networks and there might be issues in some mobile OS and Mobile Network Operators.

### Usage

In order to run the server in standalone mode, you just need to install all dependencies by doing:

```
pnpm install
```

and then go to server directory and execute:

```
cd packages/server
pnpm start
```

By default, Indy VDR Proxy Server runs at port 3000 and supports only [BCovrin Test network](http://test.bcovrin.vonx.io/). This can be overriden by either updating the configuration file located at `res/app.config.json` or providing your own by setting the environment variable `INDY_VDR_PROXY_CONFIG_PATH`. E.g.:

```
INDY_VDR_PROXY_CONFIG_PATH=/my-directory/my-config.file.json pnpm start
```

If you want to integrate Indy VDR Proxy in your own NestJS-based project, you can by importing `IndyVdrProxyServerModule`. You'll need to call `register` method passing an `IndyVdrProxyAgent` instance (which could be your own Credo-based Agent as long as it contains all required modules):

```ts
import { setupAgent } from "credo-ts-indy-vdr-proxy-server"

IndyVdrProxyModule.register(setupAgent({ networks }))
```

### Endpoints

All endpoints use HTTP GET method.

- /did/{fully qualified or legacy Indy did}: resolve a DID Document
- /schema/{fully qualified AnonCreds schema ID}: resolve an AnonCreds Schema
- /credential-definition/{fully qualified or legacy AnonCreds credential definition ID}: resolve an AnonCreds Credential Definition
- /revocation-registry-definition/{fully qualified or legacy AnonCreds revocation registry definition ID}: resolve an AnonCreds Revocation Registry Definition
- /revocation-status-list/{fully qualified or legacy AnonCreds revocation registry definition ID}/{timestamp}: resolve an AnonCreds Revocation Status List

The response for each follows the format used in `@credo-ts/anoncreds` module. It's a JSON containing three elements:

```json
{
  objectTypeInCamelCase: { ... },
  objectTypeInCamelCaseMetadata: { ... };
  resolutionMetadata: { error?: 'invalid' | 'notFound' | 'unsupportedAnonCredsMethod' | string;
    message?: string;};
}
```
