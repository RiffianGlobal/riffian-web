import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'
import { ttlStorage } from './utils'

import { bridgeStore } from './useBridge'
import { Network } from './networks'

export type DOIDCache = {
  [address: string]: string
}

// TODO: merge to ttlStore
class DOIDNameStore extends State {
  @property({ value: {} }) DOIDs!: DOIDCache

  key = (address: string) => `doid.${Network.chainId}.${address}`

  set = (address: string, name: string, save = false) => {
    this.DOIDs = { ...this.DOIDs, [address]: name }
    if (save) ttlStorage.setItem(this.key(address), name, 604800 * 1000)
    return name
  }

  promises: any = {} // debounce promise
  get = async (address: string) => {
    // 1. from state
    let name: string | null | undefined = this.DOIDs[address]
    if (name) return name
    // 2. from ttlStorage
    const stored: string | null = ttlStorage.getItem(this.key(address))
    if (stored) return this.set(address, (name = stored))
    // 3. from api
    if (!this.promises[address])
      this.promises[address] = new Promise(async (resolve) => {
        name = await bridgeStore.bridge.provider?.lookupAddress(address)
        if (name) {
          this.set(address, name, true)
          resolve(name)
        } else resolve(undefined)
      }).finally(() => delete this.promises[address])
    return this.promises[address]
  }
}
export const DOIDStore = new DOIDNameStore()
