import { shortAddress } from './utils'
import { Provider } from './provider'
import createProvider from './provider'
import { walletStore, Wallets } from './wallet'
import { WalletState, signInKey } from './wallet/constants'
import { State, property } from '@lit-web3/base/state'
import networkStore from './networks'
import { setDefaultChainId } from './constants/networks'

export class Bridge extends State {
  private selected: WalletApp | undefined
  private promise: any
  public readonly Provider: Provider
  @property({ value: walletStore }) store!: typeof walletStore
  @property({ value: false }) public alreadyTried!: boolean
  constructor(options?: useBridgeOptions) {
    super()
    this.Provider = createProvider(options)
  }
  get provider() {
    return this.Provider.provider
  }
  get network() {
    return networkStore
  }
  get wallet() {
    return walletStore.wallet
  }
  set wallet(val) {
    walletStore.wallet = val
  }

  switchNetwork = async (chainId: ChainId) => {
    if (this.wallet) await this.wallet?.switchChain(chainId)
    setDefaultChainId(chainId, !this.wallet)
  }
  async regToken(token: Tokenish, { alt = false, ext = 'svg' } = {}) {
    const { ethereum } = window
    if (!ethereum || !token) return
    const { address, symbol, decimals } = token
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC721',
        options: {
          address,
          symbol,
          decimals,
          image: `/${address}/logo${alt ? '-alt' : ''}.${ext}`
        }
      }
    })
  }
  async getSigner(address: string) {
    let signer = await this.wallet?.getSigner(address)
    if (!signer || signer.address != address) {
      console.debug(signer ? `address mismatch, want ${address}, connector is ${signer.address}` : 'can not get signer')
      throw new Error('failed to get signer')
    }
    return signer
  }
  get shortAccount() {
    return shortAddress(walletStore.account ?? '')
  }
  get state() {
    return this.wallet?.state ?? this.selected?.app?.state ?? WalletState.CONNECTING
  }
  get isConnected() {
    return this.state === WalletState.CONNECTED
  }
  connecting: any = undefined
  connectedAccounts: Address[] = []
  tryConnect = async (options: useBridgeOptions = {}) => {
    const { autoConnect = false } = options
    if (!this.connecting)
      this.connecting = (async () => {
        if (this.wallet) {
          if (this.wallet.inited) return
          // detect inited
          await this.wallet.ensure()
        }
        // TODO: support multi-wallets select
        if (walletStore.signedIn) {
          await this.select(0, false, false)
          // force select to doid-connect temporarily
          const wallet = this.wallet ?? Wallets[0].app ?? (await Wallets[0].import())
          if (wallet.state == WalletState.CONNECTED) return
          // TODO: only show signup dialog
          let address: Address[] = []
          try {
            address = await wallet.getAddresses()
          } catch {}
          this.connectedAccounts = address
          if (this.connectedAccounts?.[0]) await this.select(0, false)
        }
        this.connecting = undefined
        this.alreadyTried = true
      })()
    return this.connecting
  }
  connect = async (options: any = { force: false }) => {
    await this.wallet?.connect(options)
    if (!walletStore.signedIn) {
      localStorage.setItem(signInKey, '1')
      location.reload()
    }
  }
  disconnect = async () => {
    await this.wallet?.disconnect()
    localStorage.removeItem(signInKey)
    walletStore.clear()
    location.reload()
  }
  install = async () => {
    return this.wallet?.install()
  }
  unselect = () => {
    if (this.selected) {
      this.selected.app?.disconnect()
      this.selected = undefined
    }
  }
  select = async (i: number = 0, force = true, connect = true) => {
    const selected = (this.selected = Wallets[i])
    if (!this.promise)
      this.promise = (async () => {
        if (!this.wallet) {
          this.wallet = selected.app = await selected.import()
        }
        if (connect) await this.connect({ force })
        return this.wallet
      })().finally(() => {
        this.promise = undefined
      })
    return this.promise
  }
}

export default Bridge
