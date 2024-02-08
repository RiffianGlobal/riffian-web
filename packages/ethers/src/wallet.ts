import emitter from '@lit-web3/base/emitter'
import { sleep } from './utils'
import { State } from './state'
import { Provider, Signer } from 'ethers'

export enum WalletState {
  DISCONNECTED = 'Disconnected',
  CONNECTED = 'Connected',
  CONNECTING = 'Connecting...',
  NOT_INSTALLED = 'Not Installed',
  INSTALLED = 'Installed',
  INSTALLING = 'Installing...',
  WAITING = 'Waiting...'
}

export interface Wallet extends State {
  inited: boolean
  ensure: Function
  injected: () => boolean

  state: WalletState
  account: string
  doid: string
  readonly chainId: string
  getAddresses: () => Promise<string[]>
  getProvider: () => Promise<Provider>
  getSigner: (account: string) => Promise<Signer>
  switchChain: (chainId: string) => Promise<void>
  updateProvider: (chainId: string) => any
  connect: (config?: { force: boolean }) => any
  disconnect: () => any
  install: () => any
}

export type WalletChangedParams = {
  chainId?: string
  chainChanged?: boolean
}

let curChainId = ''
export const emitWalletChange = async (params: WalletChangedParams = {}) => {
  const { chainId = '' } = params
  if (chainId && chainId != curChainId) {
    params.chainChanged = true
    curChainId = chainId
  }
  emitter.emit('wallet-changed', params)
  await sleep(0)
  emitter.emit('force-request-update')
}
