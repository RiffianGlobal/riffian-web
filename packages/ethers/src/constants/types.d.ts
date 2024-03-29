// Networks
declare type ChainId = string
declare interface NetworkInfo {
  chainId: ChainId
  name: string
  title: string
  provider: string
  providerWs?: string
  scan: string
  icon: string
  ens?: { address?: Address; network: number }
  native?: {
    name: string
    /** 2-6 characters long */
    symbol: string
    decimals: number
  }
  domain?: string
  mainnet?: boolean
}
declare interface ChainType {
  [chainId: string]: any
}
declare type Networks = Record<ChainId, NetworkInfo>
// Contracts
declare interface ContractConf {
  [chainId: string]: ChainType
}
// Tokens
declare interface TokenConf {
  symbol: string
  name: string
  decimals: number
  address: ChainType
  icon?: string
}
declare interface Token {
  symbol: string
  name: string
  decimals: number
  amount?: string
  address?: string
}
declare type Tokenish = Token | string | any
declare type ChainConf = Record<string, Record<ChainId, string>>
