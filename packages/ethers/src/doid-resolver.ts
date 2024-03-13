import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'
import { ttlStorage } from './utils'
import { isAddress } from 'ethers'

import { getBridgeProvider } from './useBridge'
import { networkStore } from './networks'

type DOID = string
type Address = string
export type DOIDCache = {
  [doid: DOID]: Address
}
export type AddressCache = {
  [address: Address]: DOID
}

const ttl = 604800 * 1000

const addressLike = (str: string) => /^[0-9]/.test(str)

// TODO: merge to ttlStore
class DOIDNameStore extends State {
  @property({ value: {} }) DOIDs!: DOIDCache
  @property({ value: {} }) addresses!: AddressCache

  key = (key: string) => `doid.${networkStore.chainId}.${key}`

  set = (address: string, name: string, save = false) => {
    if (!address || !name) return
    this.DOIDs = { ...this.DOIDs, [address]: name }
    this.addresses = { ...this.addresses, [name]: address }
    if (save) {
      if (!networkStore.chainId) {
        console.warn('no networkStore.chainId', networkStore.chainId)
      }
      ttlStorage.setItem(this.key(address), name, ttl)
      ttlStorage.setItem(this.key(name), address, ttl)
    }
  }

  promises: any = {} // debounce promise
  get = async (req: DOID | Address): Promise<Address | DOID | undefined> => {
    const isAddr = isAddress(req)
    // Assign value
    const assign = (res: Address | DOID) => {
      address = isAddr ? req : res
      name = isAddr ? res : req
    }
    let name, address
    assign(req)
    // 1. from memcache
    const cached = isAddr ? this.addresses[req] : this.DOIDs[req]
    if (cached) return cached
    // 2. from ttlStorage
    const stored = ttlStorage.getItem(this.key(req))
    if (stored) {
      assign(stored)
      this.set(address!, name!)
      return stored
    }
    // 3. from api
    if (!this.promises[req]) {
      this.promises[req] = new Promise(async (resolve) => {
        let res
        try {
          const provider = await getBridgeProvider()
          res = await provider?.[isAddr ? 'lookupAddress' : 'resolveName'](req)
        } catch {}
        if (res) {
          assign(res)
          this.set(address!, name!, true)
          resolve(res)
        } else resolve(undefined)
      }).finally(() => delete this.promises[req])
    }
    return await this.promises[req]
  }

  getDOID = async (req: DOID | Address): Promise<DOID | undefined> => (addressLike(req) ? await this.get(req) : req)

  getAddress = async (req: DOID | Address): Promise<Address | undefined> =>
    addressLike(req) ? req : await this.get(req)
}
export const DOIDStore = new DOIDNameStore()
