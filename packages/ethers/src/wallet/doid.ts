import { Wallet, WalletState, emitWalletChange } from '../wallet'
import { State, property } from '../state'
import { JsonRpcApiProvider, JsonRpcSigner } from 'ethers'
import getProvider from '../provider'
import { chainIdStr } from '../constants/networks'

const injectedKey = 'doid-connect.injected'

export class DoidWallet extends State implements Wallet {
  public inited = false
  constructor() {
    super()
    this.init()
  }
  private connector: any
  resolved = false
  private init = async () => {
    let { doid, doidTestnet, DOIDConnectorEthers } = await import('@doid/connect-ethers')
    this.connector = new DOIDConnectorEthers()
    this.connector.updateChains([doid, doidTestnet])
    const connectorOptions = {
      appName: 'Riffian',
      themeMode: 'dark',
      walletConnectEnabled: true,
      walletConnectId: 'b9850e108fc2d1e587dd41ce1fea0a16'
    }
    if (import.meta.env.MODE === 'development') Object.assign(connectorOptions, { doidNetwork: doidTestnet })
    this.connector.updateOptions(connectorOptions)
    this.account = this.connector.account
    this.connector.subscribe((_: any, value: any) => {
      this.account = value
    }, 'account')
    this.doid = this.connector.doid
    this.connector.subscribe((_: any, value: any) => {
      this.doid = value
      if (this.doid && !value) {
        this.account = ''
        this.disconnect()
      }
    }, 'doid')
    if (this.connector.chainId) this.chainId = chainIdStr(this.connector.chainId)
    this.connector.subscribe((_: any, value: number | undefined) => {
      if (!value) return
      this.chainId = value ? chainIdStr(value) : ''
      this.doid = this.connector.doid ?? ''
      this.updateProvider(this.chainId)
    }, 'chainId')
    this.resolved = true
  }

  //-- Wallet interface implementation --
  @property() public state: WalletState = WalletState.DISCONNECTED
  @property() public account = ''
  @property() public chainId: string = ''
  @property() public doid: string = ''

  getAddresses(): Promise<string[]> {
    return this.connector.getAddresses()
  }

  getProvider(): Promise<JsonRpcApiProvider> {
    return this.connector?.getProvider()
  }

  getSigner(account: string): Promise<JsonRpcSigner> {
    return this.connector?.getSigner(this.chainId, account)
  }

  switchChain = (chainId: string) => this.connector.switchChain(Number(chainId))
  updateProvider(chainId: string) {
    this.connector.updateChainId(chainId)
    getProvider().update({ chainId })
    emitWalletChange({ chainId })
  }
  async connect({ force = false } = {}) {
    this.inited = true
    this.state = WalletState.CONNECTING
    try {
      const wallet = await this.connector.connect({ noModal: !force })
      localStorage.setItem(injectedKey, '1')
    } catch (err: any) {
      this.state = WalletState.DISCONNECTED
      console.info('Connect failed')
      console.info(err)
    } finally {
    }
  }
  disconnect = async () => {
    await this.connector.disconnect()
    localStorage.removeItem(injectedKey)
    this.state = WalletState.DISCONNECTED
    emitWalletChange()
  }
  install() {}

  ensure = () => {
    return new Promise((resolve) => {
      if (this.resolved) resolve(this)
      const resolver = () => {
        this.resolved = true
        resolve(this)
      }
      let retryTimes = 0
      const detectChainId = async () => {
        if (this.chainId) resolver()
        else if (retryTimes++ < 30) setTimeout(detectChainId, 10)
        else resolver()
      }
      detectChainId()
    })
  }
  injected = () => !!localStorage.getItem(injectedKey)
}

export const importer = {
  name: 'DOID',
  title: 'DOID',
  icon: '',
  app: undefined,
  import: async () => new DoidWallet().ensure()
}
