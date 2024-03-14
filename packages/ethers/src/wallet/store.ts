import { signInKey } from './constants'
import { State, property, storage } from '@lit-web3/base/state'
import { chainIdStr, defaultChainId } from '../constants/networks'
import { shortAddress } from '../utils'
export { StateController } from '@lit-web3/base/state'
import emitter from '@lit-web3/base/emitter'
import { sleep } from '../utils'

class WalletStore extends State {
  @property({ value: undefined }) wallet?: Wallet
  @property({ value: '' }) account!: string
  @property({ value: '' }) doid!: string

  @storage({ key: 'wallet.chainId' })
  @property({ value: '' })
  chainId!: string

  constructor() {
    super()
    this.subscribe((_, walletApp) => {
      const { account = '', chainId = '', doid = '' } = walletApp ?? {}
      this.setChainId(chainId)
      this.setAccount(account)
      this.setDoid(doid)
    }, 'wallet')
  }

  setChainId = (val: string | number = '') => (this.chainId = chainIdStr(val))
  setAccount = (val = '') => {
    const newAccount = this.signedIn ? val : ''
    if (this.account && newAccount && this.account != newAccount) {
      location.reload()
      // emitWalletChange()
    }
    this.account = newAccount
  }
  setDoid = (val = '') => {
    this.doid = this.signedIn ? val : ''
    emitWalletChange()
  }
  clear = () => {
    this.setAccount('')
    this.setDoid('')
    this.setChainId(defaultChainId)
  }

  get signedIn() {
    return !!localStorage.getItem(signInKey)
  }
  get shortAccount() {
    return shortAddress(this.account)
  }
}
/** Singleton wallet store, to keep current selected wallet. */
export const walletStore = new WalletStore()

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
