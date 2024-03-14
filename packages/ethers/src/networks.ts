import {
  defaultChainId,
  mainnetOffline,
  mainnetChainId,
  SupportNetworks,
  unknownNetwork,
  chainIdStr
} from './constants/networks'
import { State, property } from '@lit-web3/base/state'
import { walletStore, emitWalletChange } from './wallet/store'
export { StateController } from '@lit-web3/base/state'

export const Networks: Networks = SupportNetworks
export { defaultChainId, mainnetChainId }

// This may return wrong network value if no req provided
// If you want to get current network, please use `userBridge/getNetwork` instead
export const getNetwork = (req?: string, exactly: boolean = false): NetworkInfo => {
  const def = exactly
    ? unknownNetwork
    : Networks[networkStore.chainId] ?? Networks[defaultChainId] ?? Networks[mainnetChainId]
  if (req === undefined) return def
  let res = Networks[req] ?? Object.values(Networks).find((r) => r.name === req)
  return res ?? def
}

const assignChainId = () => {
  const chainId = walletStore.signedIn ? walletStore.chainId : defaultChainId
  return chainId ? chainIdStr(chainId) : ''
}

export class Network extends State {
  public static readonly mainnetChainId: ChainId = mainnetChainId
  public static readonly defaultChainId: ChainId = defaultChainId
  public opts: Record<string, unknown> = {}

  @property({ value: assignChainId() }) chainId!: ChainId

  constructor() {
    super()
    walletStore.subscribe(() => {
      const newChainId = assignChainId()
      const changed = this.chainId != newChainId
      if (changed) location.reload()
      // this.chainId = newChainId
      // emitWalletChange()
    }, 'chainId')
  }

  get Networks() {
    return Networks
  }
  get isMainnet() {
    return this.chainId ? [mainnetChainId].includes(this.chainId) : false
  }
  get current(): NetworkInfo {
    return this.chainId ? this.Networks[this.chainId] ?? unknownNetwork : unknownNetwork
  }
  get default() {
    return this.Networks[defaultChainId]
  }
  get unSupported() {
    return this.current.name === 'unknown'
  }
  get isDefaultNet() {
    return this.current.chainId === defaultChainId
  }
  get mainnetOffline() {
    return this.isMainnet && mainnetOffline
  }
  get disabled() {
    return this.unSupported || this.mainnetOffline
  }
  get isTestnet() {
    return this.current.name === 'testnet'
  }
  get provider() {
    return this.current.provider
  }
  get providerWs() {
    return this.current.providerWs
  }
  get title() {
    return this.isMainnet ? '' : this.current.title
  }
  get name() {
    return this.current.name
  }
}
export const networkStore = new Network()
export default networkStore
