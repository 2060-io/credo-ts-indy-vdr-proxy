# Credo Indy VDR Proxy client

This package provides some convenient classes to allow an Agent built on [Credo](https://github.com/openwallet-foundation/credo-ts) resolve DIDs and AnonCreds objects from a number of Indy networks without the need of embedding any [indy-vdr](https://github.com/hyperledger/indy-vdr) client binary.

Especially conceived for mobile agents use case, this makes the app lighter and avoids the need of managing ZMQ sockets, as only a simple HTTP REST API is used to retrieve Indy objects.

It works with its companion [Credo Indy VDR Proxy Server](https://github.com/2060-io/credo-ts-indy-vdr-proxy/tree/main/packages/server), expected to be run as a server trusted by the mobile app (as all Indy transactions will go through it).

## Usage

As of Credo 0.5.0, the most convenient way to use the classes provided by this package is by injecting them in Agent constructor:

```ts
import { IndyVdrProxyAnonCredsRegistry, IndyVdrProxyDidResolver } from 'credo-ts-indy-vdr-proxy-client'

const proxyBaseUrl = 'https://proxy-host.com'

const agent = new Agent({
  config: {
    /* agent config */
  },
  dependencies,
  modules: {
    /* ... */
    anoncreds: new AnonCredsModule({ registries: [ /* ... */ new IndyVdrProxyAnonCredsRegistry({ proxyBaseUrl, headers })] }),
    dids: new DidsModule({
      resolvers: [
        /* ... */
        new IndyVdrProxyDidResolver( { proxyBaseUrl, headers }),
      ],
     },
  },
})
```

And that's it!

Keep in mind that these implementation collide with other resolvers and registries for Indy networks, such as the ones from `@credo-ts/indy-vdr` package, so you'll need to choose to use one or the another when setting up an Agent.

## Configuration

In the constructor for both the AnonCreds Registry and DID Resolver, you can configure basic parameters to access your Indy VDR Proxy server:

- `proxyBaseUrl`: base URL for your proxy
- `headers`: optional object or callback containing request headers your proxy might need (e.g. authorization tokens)

In addition, `IndyVdrProxyAnonCredsRegistry` adds a `cacheOptions` object that allows to set up object caching. By default, AnonCreds objects are cached with a validity of 5 minutes. This is mostly useful to reduce the number of calls to the proxy in a single flow that might need to retrieve the same object multiple times.
