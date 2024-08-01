export type Headers = Record<string, string> | (() => Record<string, string>) | (() => Promise<Record<string, string>>)
