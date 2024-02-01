# Credo Indy VDR Proxy

This repository contains a server exposing a REST API to resolve objects in Indy ledgers and a client for usage with a [Credo](https://github.com/openwallet-foundation/credo-ts) Agent .

By using these components, your mobile application based on Credo can delegate Indy object resolution to a trusted server supporting any Indy networks you want. This makes the app lighter and avoids the need of managing ZMQ sockets within the mobile environment, which could cause troubles in certain situations.

Take a look at the documentation of [client](./packages/client/README.md) and [server](./packages/server/README.md) for more details.
