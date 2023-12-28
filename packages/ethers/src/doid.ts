import { WalletApp } from './bridge'
import { Wallet, WalletState, emitWalletChange } from './wallet'
import { State, property } from './state'
import { JsonRpcApiProvider, JsonRpcSigner } from 'ethers'
import { chainIdStr } from './constants/networks'

export class DoidWallet extends State implements Wallet, WalletApp {
  private connector: any
  private async init() {
    let { defineChain, doid, doidTestnet, DOIDConnectorEthers } = await import('@doid/connect-ethers')
    this.connector = new DOIDConnectorEthers()
    this.connector.updateChains([doid, doidTestnet])
    this.connector.updateOptions({
      themeMode: 'dark',
      web3AuthEnabled: true,
      walletConnectEnabled: true,
      walletConnectId: 'b9850e108fc2d1e587dd41ce1fea0a16'
    })
    if (import.meta.env.MODE !== 'production') {
      this.connector.updateOptions({
        web3AuthClientId: 'BNJiGOMfJH5myW47e6KudQGuWPYMBAyu4i7S5ZuEWiam2qDhokXmn0lmsfL9J4RZcT7W2epBrc8EEtUg2J_ACbM'
      })
    }
    this.account = this.connector.account
    this.connector.subscribe((_: any, value: any) => {
      this.account = value
    }, 'account')
    this.doid = this.connector.doid
    this.connector.subscribe((_: any, value: any) => {
      this.doid = value
    }, 'doid')
    if (this.connector.chainId) this.chainId = chainIdStr(this.connector.chainId)
    this.connector.subscribe((_: any, value: number | undefined) => {
      this.chainId = value ? chainIdStr(value) : ''
    }, 'chainId')
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

  updateProvider(chainId: string) {
    this.connector.switchChain(Number(chainId))
  }
  async connect({ force } = { force: false }) {
    this.state = WalletState.CONNECTING
    await this.connector
      .connect({ noModal: !force })
      .then(() => {
        this.state = WalletState.CONNECTED
      })
      .catch((err: any) => {
        this.state = WalletState.DISCONNECTED
        console.info('Connect failed')
        console.info(err)
      })
  }
  async disconnect() {
    await this.connector.disconnect()
    this.state = WalletState.DISCONNECTED
    emitWalletChange()
  }
  install() {}

  // -- WalletApp interface implementation --
  readonly name = 'DOID'
  readonly title = 'DOID'
  readonly icon = ''
  @property() public app?: Wallet
  private initializer: any
  import = async () => {
    if (!this.app) {
      if (!this.initializer) this.initializer = this.init()
      await this.initializer
      if (!this.app) {
        this.app = this
      }
    }
    return this
  }
}
