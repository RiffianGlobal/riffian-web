import { walletStore } from './bridge'
import { AllNetworks, unknownNetwork, SupportNetworks } from './constants/networks'
import { State, property } from './state'

const isProd = import.meta.env.MODE === 'production'
const mainnetOffline = !!import.meta.env.VITE_DISABLE_MAINNET
export const Networks: Networks = AllNetworks

export const [mainnetChainId, testnet] = SupportNetworks
export const defaultChainId = isProd && !mainnetOffline ? mainnetChainId : import.meta.env.VITE_DEF_TESTNET ?? testnet

// This may return wrong network value if no req provided
// If you want to get current network, please use `userBridge/getNetwork` instead
export const getNetwork = (req?: string, exactly: boolean = false): NetworkInfo => {
  const def = exactly
    ? unknownNetwork
    : Networks[Network.chainId] ?? Networks[Network.defaultChainId] ?? Networks[mainnetChainId]
  if (req === undefined) return def
  let res = Networks[req] ?? Object.values(Networks).find((r) => r.name === req)
  return res ?? def
}

export class Network extends State {
  public static readonly mainnetChainId: ChainId = mainnetChainId
  public static readonly defaultChainId: ChainId = defaultChainId
  private static _chainId: ChainId = defaultChainId
  public static get chainId(): ChainId {
    return Network._chainId
  }
  // make set chainId private to Network only
  private static set chainId(value: ChainId) {
    Network._chainId = value
  }
  public opts: Record<string, unknown> = {}
  @property() private chainId: ChainId
  constructor(chainId?: ChainId, opts = {}) {
    super()
    if (chainId) Network.chainId = chainId
    this.chainId = Network.chainId
    Object.assign(this.opts, opts)
  }
  /** SHOULD only be called in bridge::switchNetwork when succeeded */
  public setChainId(chainId: ChainId) {
    this.chainId = Network.chainId = chainId
  }
  get Networks() {
    return Networks
  }
  get isMainnet() {
    return this.chainId ? [Network.mainnetChainId].includes(this.chainId) : false
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
export default Network
