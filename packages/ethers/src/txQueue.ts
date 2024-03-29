import { State, property } from '@lit-web3/base/state'
import useBridge, { getNonce } from './useBridge'
import { walletStore } from './wallet/store'
import { Networks } from './networks'

class TxQueueStore extends State {
  key = ''
  constructor(key: string) {
    super()
    this.key = key
    this.sync()
  }
  @property({ value: [] }) queue!: txSeq[]
  sync() {
    this.queue = JSON.parse(localStorage.getItem(this.key) || '[]')
  }
  save() {
    this.queue = [...this.queue]
    localStorage.setItem(this.key, JSON.stringify(this.queue))
  }
}

export type txSeq = {
  hash: string
  ts: string
  chainId: string
  pending?: boolean
  done?: boolean
  err?: boolean | string
  scan?: string
  title?: string
  type: string
  nonce: `${number}`
  amount?: string
  symbol?: string
}

const txTimeout = 7200 * 1000 // 2h

export class TxQueue {
  public store: any
  public checking: Set<string>
  public storage: any
  public provider: any

  constructor(address?: string) {
    this.provider = useBridge().bridgeStore.bridge.provider
    // this.queue = useLocalStorage(`evm.txs.${walletStore.account}`, [], { listenToStorageChanges: false })
    this.store = new TxQueueStore(`evm.txs.${address || walletStore.account}`)
    this.checking = new Set()
    this.check(true)
  }
  get queue() {
    return this.store.queue
  }
  async add(tx: txSeq) {
    if (!tx.chainId) {
      tx.chainId = walletStore.chainId
      tx.scan = Networks[tx.chainId].scan
    }
    tx.pending = true
    this.queue.unshift(tx)
    this.store.save()
    this.provider.nonce = +tx.nonce + 1
  }
  delDelay(tx: txSeq | string | any, delay: number = 0) {
    setTimeout(() => this.del(tx), delay)
  }
  del(tx: txSeq | string | any) {
    const key = tx.hash ?? tx.ts ?? tx
    this.queue.some((seq: any, i: number) => {
      if ([seq.hash, seq.ts, seq].includes(key)) {
        if (i === 0) this.provider.nonce = 0
        const found = this.queue.splice(i, 1)
        this.store.save()
        return found
      }
    })
  }
  async check(force: boolean) {
    this.queue.forEach(async (seq: any, i: number) => {
      if (force && i === 0) {
        const nonce = await getNonce(walletStore.account)
        const seqNonce = +seq.nonce
        this.provider.nonce = seqNonce > nonce ? seqNonce + 1 : nonce
      }
      if (seq.done || new Date().getTime() - seq.ts >= txTimeout) return this.del(seq)
      if (seq.err) return
      if (!force && seq.pending) return
      seq.pending = true
      try {
        const res = await this.provider.waitForTransaction(seq.hash)
        const { status } = res
        seq.status = status
        if (status === 1) {
          seq.done = true
          this.del(seq)
        } else {
          seq.err = true
        }
      } catch (err: any) {
        seq.err = err
      }
      seq.pending = false
    })
    this.store.save()
  }
}
const cached: Record<string, TxQueue> = {}
export const getTxQueue = (account = walletStore.account) => cached[account] || (cached[account] = new TxQueue(account))

export default getTxQueue
