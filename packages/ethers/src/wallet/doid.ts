import { Wallet, WalletState, emitWalletChange } from '../wallet'
import { State, property } from '../state'
import { JsonRpcApiProvider, JsonRpcSigner } from 'ethers'
import getProvider from '../provider'
import Network from '../networks'

const injectedKey = 'doid-connect.injected'

export class DoidWallet extends State implements Wallet {
  public inited = false
  constructor() {
    super()
    this.init()
  }
  private connector: any
  resolved = false
  private chains?: any[]
  private init = async () => {
    let { doid, doidTestnet, DOIDConnectorEthers } = await import('@doid/connect-ethers')
    this.chains = [doid, doidTestnet]
    this.connector = new DOIDConnectorEthers()
    const connectorOptions = {
      appName: 'Riffian',
      themeMode: 'dark',
      chains: this.chains,
      doidNetwork: Number(Network.chainId) == doidTestnet.id ? doidTestnet : doid,
      walletConnectEnabled: true,
      walletConnectId: 'b9850e108fc2d1e587dd41ce1fea0a16'
    }
    // if (import.meta.env.MODE === 'development') Object.assign(connectorOptions, { doidNetwork: doidTestnet })
    this.connector.updateOptions(connectorOptions)
    // this.account = this.connector.account
    this.connector.subscribe((_: any, value: any) => {
      this.account = value
    }, 'account')
    // this.doid = this.connector.doid
    this.connector.subscribe((_: any, value: any) => {
      this.doid = value
      if (this.doid && !value) {
        this.account = ''
        this.disconnect()
      }
    }, 'doid')
    // No need to expose chainId, Network.chainId is used when getting provider or contract instance
    // if (this.connector.chainId) this.chainId = chainIdStr(this.connector.chainId)
    // this.connector.subscribe((_: any, value: number | undefined) => {
    //   if (!value) return
    //   this.chainId = value ? chainIdStr(value) : ''
    //   this.doid = this.connector.doid ?? ''
    //   this.updateProvider(this.chainId)
    // }, 'chainId')

    // switch to Network.chainId
    await this.connector.switchChain(Number(Network.chainId)).catch(console.warn)
    this.resolved = true
  }

  //-- Wallet interface implementation --
  @property() public state: WalletState = WalletState.DISCONNECTED
  @property() public account = ''
  get chainId() {
    return Network.chainId
  }
  @property() public doid: string = ''

  getAddresses(): Promise<string[]> {
    return this.connector?.getAddresses().catch((e: any) => {
      console.warn(e)
      return []
    })
  }

  getProvider(): Promise<JsonRpcApiProvider> {
    return this.connector?.getProvider(Number(Network.chainId))
  }

  getSigner(account: string): Promise<JsonRpcSigner> {
    return this.connector?.getSigner(Number(Network.chainId), account)
  }

  switchChain = (chainId: string) => {
    console.debug(`Switch to chain id ${chainId}`)
    this.chains?.find((x) => {
      if (x.id == chainId) {
        this.connector.updateOptions({ doidNetwork: x })
        return true
      }
      return false
    })
    // this.connector?.updateChainId(chainId)
    return this.connector
      .connect({ noModal: true })
      .then(() => this.connector?.switchChain(Number(chainId)))
      .then(() => console.log('switched'))
      .catch((e) => console.warn(e))
    //.finally(() => this.updateProvider(chainId))
    // this.connector?.connect({ noModal: true })
  }
  updateProvider(chainId: string) {
    console.debug(`Update provider with chain id ${chainId}`)
    this.connector?.updateChainId(chainId)
    getProvider().update({ chainId })
    emitWalletChange({ chainId })
  }
  async connect({ force = false } = {}) {
    this.inited = true
    this.state = WalletState.CONNECTING
    try {
      const wallet = await this.connector?.connect({ noModal: !force })
      console.debug('Sign In returns', wallet)
      this.account = wallet?.account
      this.doid = wallet?.doid
      localStorage.setItem(injectedKey, '1')
    } catch (err: any) {
      this.state = WalletState.DISCONNECTED
      console.info('Connect failed')
      console.info(err)
    } finally {
    }
  }
  disconnect = async () => {
    await this.connector?.disconnect()
    localStorage.removeItem(injectedKey)
    this.state = WalletState.DISCONNECTED
    emitWalletChange()
  }
  install() {}

  ensure = () => {
    return new Promise((resolve) => {
      if (this.resolved) resolve(this)
      const resolver = () => {
        // this.resolved = true
        resolve(this)
      }
      let retryTimes = 0
      // chainId can not be detected if no connection yet, so check resolved.
      const detectResolved = async () => {
        if (this.resolved) resolver()
        else if (retryTimes++ < 30) setTimeout(detectResolved, 10)
        else resolver()
      }
      detectResolved()
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
