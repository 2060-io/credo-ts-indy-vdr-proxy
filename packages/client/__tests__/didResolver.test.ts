import { parseDid } from '@credo-ts/core'
import nock, { cleanAll, enableNetConnect } from 'nock'

import { IndyVdrProxyDidResolver } from '../src/dids'

import didDocument1 from './__fixtures__/did1.json'
import { agent } from './agent'

describe('Did Resolver', () => {
  beforeAll(async () => {
    await agent.initialize()
  })

  afterEach(() => {
    cleanAll()
    enableNetConnect()
  })

  test('resolves did document correctly (without headers)', async () => {
    const client = new IndyVdrProxyDidResolver({
      proxyBaseUrl: 'https://proxybaseurl.com',
    })

    // did document
    const did = 'did:indy:test:asdf'
    nock(`https://proxybaseurl.com`)
      .get(`/did/${encodeURIComponent(did)}`)
      .reply(200, {
        didResolutionMetadata: {},
        didDocument: didDocument1,
        didDocumentMetadata: {},
      })

    const result = await client.resolve(agent.context, did, parseDid(did))
    expect(result).toEqual({
      didResolutionMetadata: {},
      didDocument: didDocument1,
      didDocumentMetadata: {},
    })
  })

  test('resolves did document correctly (with static headers)', async () => {
    const client = new IndyVdrProxyDidResolver({
      proxyBaseUrl: 'https://proxybaseurl.com',
      headers: { someHeader: 'someToken' },
    })

    // did document
    const did = 'did:indy:test:asdf'

    nock(`https://proxybaseurl.com`, { reqheaders: { someHeader: 'someToken' } })
      .get(`/did/${encodeURIComponent(did)}`)
      .reply(200, {
        didResolutionMetadata: {},
        didDocument: didDocument1,
        didDocumentMetadata: {},
      })

    const result = await client.resolve(agent.context, 'did:indy:test:asdf', parseDid('did:indy:test.asdf'))
    expect(result).toEqual({
      didResolutionMetadata: {},
      didDocument: didDocument1,
      didDocumentMetadata: {},
    })
  })

  test('resolves did document correctly (with dynamic headers)', async () => {
    const getHeaders = () => ({ someHeader: 'someToken' })
    const client = new IndyVdrProxyDidResolver({
      proxyBaseUrl: 'https://proxybaseurl.com',
      headers: getHeaders(),
    })

    // did document
    const did = 'did:indy:test:asdf'

    nock(`https://proxybaseurl.com`, { reqheaders: { someHeader: 'someToken' } })
      .get(`/did/${encodeURIComponent(did)}`)
      .reply(200, {
        didResolutionMetadata: {},
        didDocument: didDocument1,
        didDocumentMetadata: {},
      })

    const result = await client.resolve(agent.context, 'did:indy:test:asdf', parseDid('did:indy:test.asdf'))
    expect(result).toEqual({
      didResolutionMetadata: {},
      didDocument: didDocument1,
      didDocumentMetadata: {},
    })
  })
})
