import { JsonRpcProvider, BrowserProvider, WebSocketProvider } from 'ethers'
import { walletStore } from './wallet'
import { networkStore } from './networks'
import { DOIDWallet } from './wallet/doid'
import { State, property } from '@lit-web3/base/state'

export class Provider extends State {
  @property() public provider?: BrowserProvider | JsonRpcProvider | WebSocketProvider | any

  constructor(options: useBridgeOptions = {}) {
    super()
    const { persistent } = options

    this.update(options)
    walletStore.subscribe(() => this.update(options), 'wallet')
  }
  update = async (options: useBridgeOptions = {}) => {
    const { persistent, provider, rpc } = options
    // TODO: Allow update when options.rpc changed
    if (this.provider) {
      this.provider.removeAllListeners()
    }
    // Option 1. Use signedIn provider
    if (!persistent && walletStore.signedIn && walletStore.wallet) {
      this.provider = await walletStore.wallet.getProvider(+networkStore.chainId)
    } else {
      // Option 2. Use client provider (readonly) (No DOID-Resolver yet)
      // const _provider = provider || JsonRpcProvider
      // const _rpc = rpc || this.network.provider
      // this.provider = new _provider(_rpc)
      // Option 3. Use wallet provider (readonly) (with DOID-Resolver)
      this.provider = provider || (await DOIDWallet.getProvider())
    }
  }
}

let _provider: any

export default function (options?: useBridgeOptions) {
  return _provider ?? (_provider = new Provider(options))
}
