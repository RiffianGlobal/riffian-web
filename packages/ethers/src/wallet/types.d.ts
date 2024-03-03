/// <reference types="ethers" />
/// <reference types="./constants" />

declare interface Wallet {
  inited: boolean
  ensure: Function
  injected?: () => boolean

  state: WalletState
  account: string
  doid: string
  chainId: string
  getAddresses: () => Promise<string[]>
  getProvider: (chainId?: number) => Promise<Provider>
  getSigner: (account: string) => Promise<Signer>
  switchChain: (chainId: string) => any
  connect: (config?: { force?: boolean }) => any
  disconnect: () => any
  install: () => any
}

declare type WalletChangedParams = {
  chainId?: string
  chainChanged?: boolean
}

declare interface WalletApp {
  name: string
  title: string
  icon: string
  app?: Wallet
  import: () => Promise<Wallet>
  state?: WalletState
}
declare type WalletList = WalletApp[]
