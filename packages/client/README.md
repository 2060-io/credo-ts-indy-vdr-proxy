# Aries JavaScript Indy VDR Proxy client

This package provides some convenient classes to allow an Agent built on [Aries Framework JavaScript](https://github.com/hyperledger/aries-framework-javascript) resolve DIDs and AnonCreds objects from a number of Indy networks without the need of embedding any [indy-vdr](https://github.com/hyperledger/indy-vdr) client binary.

Especially conceived for mobile agents use case, this makes the app lighter and avoids the need of managing ZMQ sockets, as only a simple HTTP REST API is used to retrieve Indy objects.

It works with its companion [Aries JavaScript Indy VDR Proxy Server](https://github.com/2060-io/aries-javascript-indy-vdr-proxy/tree/main/packages/server), expected to be run as a server trusted by the mobile app (as all Indy transactions will go through it).

## Usage

As of AFJ 0.4.0, the most convenient way to use the classes provided by this package is by injecting them in Agent constructor:

```ts
import { IndyVdrProxyAnonCredsRegistry, IndyVdrProxyDidResolver } from 'aries-javascript-indy-vdr-proxy-client'

const proxyBaseUrl = 'https://proxy-host.com'

const agent = new Agent({
  config: {
    /* agent config */
  },
  dependencies,
  modules: {
    /* ... */
    anoncreds: new AnonCredsModule({ registries: [ /* ... */ new IndyVdrProxyAnonCredsRegistry(proxyBaseUrl)] }),
    dids: new DidsModule({
      resolvers: [
        /* ... */
        new IndyVdrProxyDidResolver(proxyBaseUrl),
      ],
     },
})
```

And that's it!

Keep in mind that these implementation collide with other resolvers and registries for Indy networks, such as the ones from `@aries-framework/indy-vdr` package, so you'll need to choose to use one or the another when setting up an Agent.
