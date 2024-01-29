import { JsonRpcProvider, BrowserProvider, WebSocketProvider } from 'ethers'
import Network from './networks'
import { walletStore } from './bridge'
import { State, property } from './state'
import emitter from '@lit-web3/base/emitter'

export class Provider extends State {
  @property() public provider?: BrowserProvider | JsonRpcProvider | WebSocketProvider | any
  @property() public readonly network: Network
  private storage: any
  constructor(options: useBridgeOptions = {}) {
    super()
    const { chainId, persistent } = options
    if (!persistent) this.storage = sessionStorage.getItem('chainId')
    this.network = new Network(chainId ?? walletStore.walletChainId ?? this.storage)
    if (walletStore.curWallet) this.update(options)
    walletStore.subscribe(() => this.update(options), 'wallet')
    this.network.subscribe(() => this.update(options), 'chainId')
  }
  update = async (options: useBridgeOptions = {}) => {
    let { chainId } = this.network
    const { persistent, provider, rpc } = options
    if (!persistent && walletStore.walletChainId) chainId = walletStore.walletChainId
    // TODO: Allow update when options.rpc changed
    if (this.provider) {
      this.provider.removeAllListeners()
    }
    if (!chainId) chainId = Network.defaultChainId
    this.network.chainId = chainId
    if (!persistent) this.storage = sessionStorage.setItem('chainId', chainId)
    let wallet = walletStore.curWallet
    if (!persistent && wallet?.injected()) {
      this.provider = await wallet.getProvider()
    } else {
      this.provider = provider || (await wallet?.getProvider())
      // const _provider = provider || JsonRpcProvider
      // const _rpc = rpc || this.network.provider
      // this.provider = new _provider(_rpc)
    }
    emitter.emit('network-change', '')
  }
}

let provider: any

export default function (options?: useBridgeOptions) {
  return provider ?? (provider = new Provider(options))
}
