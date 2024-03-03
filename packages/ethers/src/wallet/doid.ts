import { WalletState } from './'
import { State, property } from '@lit-web3/base/state'
import { JsonRpcApiProvider, JsonRpcSigner } from 'ethers'
import { SupportNetworkIDs } from '../constants/networks'
import { networkStore } from '../networks'
import { walletStore } from './store'
// sync import
import { doid as mainnet, doidTestnet as testnet, DOIDConnectorEthers } from '@doid/connect-ethers'

const networkIDs = SupportNetworkIDs.map((r) => +r)

export class DOIDConnect extends State implements Wallet {
  public inited = false
  constructor() {
    super()
    this.init()
  }
  private connector: any
  resolved = false

  private init = async () => {
    const chains = [mainnet, testnet].filter((r) => networkIDs.includes(r.id))
    this.connector = new DOIDConnectorEthers()
    const connectorOptions = {
      appName: 'Riffian',
      themeMode: 'dark',
      chains,
      doidNetwork: chains.find((r) => +r.id == +networkStore.chainId),
      walletConnectEnabled: true,
      walletConnectId: 'b9850e108fc2d1e587dd41ce1fea0a16'
    }
    // S TODO (bug): doid-connect needs to use options chainId on init phase
    if (!networkStore.unSupported) this.connector.updateOptions(connectorOptions)
    try {
      // if (!walletStore.signedIn) await this.connector.switchChain(+networkStore.chainId)
    } catch {}
    // E
    this.syncWallet(true)
  }

  //-- Wallet interface implementation --
  @property() public state: WalletState = WalletState.DISCONNECTED

  get chainId() {
    return walletStore.chainId
  }
  get account() {
    return walletStore.account
  }
  get doid() {
    return walletStore.doid
  }

  // Sync data to walletStore
  syncWallet = (listen = false) => {
    const { subscribe, chainId, account, doid } = this.connector
    // Sync chainId
    if (chainId !== undefined) walletStore.setChainId(chainId)
    if (listen)
      subscribe((_: any, val: number) => {
        if (walletStore.signedIn && val) walletStore.setChainId(val)
      }, 'chainId')
    // Sync account
    if (account !== undefined) walletStore.setAccount(account)
    if (listen)
      subscribe((_: any, val = '') => {
        walletStore.setAccount(val)
      }, 'account')
    // Sync DOID
    if (doid !== undefined) walletStore.setDoid(doid)
    if (listen)
      subscribe((_: any, val: any) => {
        if (walletStore.doid && !val) this.disconnect()
        else walletStore.setDoid(val)
      }, 'doid')
  }

  getAddresses = (): Promise<string[]> => {
    return this.connector?.getAddresses()
  }

  getProvider = async (chainId?: number): Promise<JsonRpcApiProvider> => {
    await this.ensure()
    return this.connector?.getProvider(chainId)
  }

  getSigner = (account: string): Promise<JsonRpcSigner> => {
    return this.connector?.getSigner(this.connector.chainId, account)
  }

  switchChain = async (chainId: string) => {
    try {
      await this.connector?.switchChain(+chainId)
      walletStore.setChainId(chainId)
      this.connector?.setWalletChainId(chainId)
    } catch {}
  }
  async connect({ force = false } = {}) {
    this.inited = true
    this.state = WalletState.CONNECTING
    try {
      await this.connector?.connect({ noModal: !force })
      // this.syncWallet()
    } catch (err: any) {
      this.state = WalletState.DISCONNECTED
      throw err
    }
  }
  disconnect = async () => {
    // Just clear user's `signIn` action, not really disconnect
    // await this.connector?.disconnect()
    walletStore.clear()
    this.state = WalletState.DISCONNECTED
  }
  install() {}

  ensure = (): Promise<Wallet> => {
    return new Promise((resolve) => {
      if (this.resolved) resolve(this)
      const resolver = () => {
        this.resolved = true
        resolve(this)
      }
      let retryTimes = 0
      const detectChainId = async () => {
        if (this.connector) resolver()
        else if (retryTimes++ < 30) setTimeout(detectChainId, 10)
        else resolver()
      }
      detectChainId()
    })
  }
}

export const DOIDWallet = new DOIDConnect()

export const importer: WalletApp = {
  name: 'DOID',
  title: 'DOID',
  icon: '',
  app: undefined,
  import: async () => DOIDWallet.ensure()
}
