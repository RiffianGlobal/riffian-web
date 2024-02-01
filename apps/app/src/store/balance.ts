import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'
import { emitter } from '@lit-web3/base/emitter'
import { getAccount, getNativeBalance, getBridgeProvider } from '@riffian-web/ethers/src/useBridge'

// !This store only cache first page data of subjects
class BalanceStore extends State {
  @property({ value: '' }) balance!: string

  constructor() {
    super()
    this.init()
  }

  promise: any = null
  fetch = async () => {
    if (!this.promise) {
      this.promise = new Promise<void>(async (resolve) => {
        const acc = await getAccount()
        const newBalance = await getNativeBalance(acc)
        if (newBalance != this.balance) emitter.emit('block-balance', acc)
        this.balance = acc ? newBalance : ''
        resolve()
      }).finally(() => {
        this.promise = null
      })
    }
    return this.promise
  }

  provider: any
  listen = async () => {
    this.provider = await getBridgeProvider()
    this.provider.on('block', this.fetch)
    return () => this.provider.off('block', this.fetch)
  }
  init = async () => {
    this.fetch()
    let unlisten = await this.listen()
    emitter.on('wallet-changed', async () => {
      unlisten()
      unlisten = await this.listen()
    })
  }
}
export const balanceStore = new BalanceStore()
