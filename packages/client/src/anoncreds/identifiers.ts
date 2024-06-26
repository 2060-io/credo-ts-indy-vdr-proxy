/* eslint-disable max-len */
const DID_INDY_REGEX = /^did:indy:((?:[a-z][_a-z0-9-]*)(?::[a-z][_a-z0-9-]*)?):([1-9A-HJ-NP-Za-km-z]{21,22})$/

const didIndyAnonCredsBase =
  /(did:indy:((?:[a-z][_a-z0-9-]*)(?::[a-z][_a-z0-9-]*)?):([1-9A-HJ-NP-Za-km-z]{21,22}))\/anoncreds\/v0/

// did:indy:<namespace>:<namespaceIdentifier>/anoncreds/v0/SCHEMA/<schemaName>/<schemaVersion>
const didIndySchemaIdRegex = new RegExp(`^${didIndyAnonCredsBase.source}/SCHEMA/(.+)/([0-9.]+)$`)

// <namespaceIdentifier>:2:<schemaName>:<schemaVersion>
const legacyIndySchemaIdRegex = /^([a-zA-Z0-9]{21,22}):2:(.+):([0-9.]+)$/

// did:indy:<namespace>:<namespaceIdentifier>/anoncreds/v0/CLAIM_DEF/<schemaSeqNo>/<tag>
const didIndyCredentialDefinitionIdRegex = new RegExp(`^${didIndyAnonCredsBase.source}/CLAIM_DEF/([1-9][0-9]*)/(.+)$`)

// <namespaceIdentifier>:3:CL:<schemaSeqNo>:<tag>
const legacyIndyCredentialDefinitionIdRegex = /^([a-zA-Z0-9]{21,22}):3:CL:([1-9][0-9]*):(.+)$/

// did:indy:<namespace>:<namespaceIdentifier>/anoncreds/v0/REV_REG_DEF/<schemaSeqNo>/<credentialDefinitionTag>/<revocationRegistryTag>
const didIndyRevocationRegistryIdRegex = new RegExp(
  `^${didIndyAnonCredsBase.source}/REV_REG_DEF/([1-9][0-9]*)/(.+)/(.+)$`
)

// <namespaceIdentifier>:4:<schemaSeqNo>:3:CL:<credentialDefinitionTag>:CL_ACCUM:<revocationRegistryTag>
const legacyIndyRevocationRegistryIdRegex =
  /^([a-zA-Z0-9]{21,22}):4:[a-zA-Z0-9]{21,22}:3:CL:([1-9][0-9]*):(.+):CL_ACCUM:(.+)$/

// combines both legacy and did:indy anoncreds identifiers and also the issuer id
const indyVdrAnonCredsRegexes = [
  // NOTE: we only include the qualified issuer id here, as we don't support registering objects based on legacy issuer ids.
  // you can still resolve using legacy issuer ids, but you need to use the full did:indy identifier when registering.
  // As we find a matching anoncreds registry based on the issuerId only when creating an object, this will make sure
  // it will throw an no registry found for identifier error.
  // issuer id
  DID_INDY_REGEX,

  // schema
  didIndySchemaIdRegex,
  legacyIndySchemaIdRegex,

  // credential definition
  didIndyCredentialDefinitionIdRegex,
  legacyIndyCredentialDefinitionIdRegex,

  // revocation registry
  legacyIndyRevocationRegistryIdRegex,
  didIndyRevocationRegistryIdRegex,
]

export const indyVdrAnonCredsRegistryIdentifierRegex = new RegExp(
  indyVdrAnonCredsRegexes.map((r) => r.source).join("|")
)
