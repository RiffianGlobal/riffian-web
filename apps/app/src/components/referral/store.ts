import { getAccount, bridgeStore, getContract, getContracts, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { solidityPackedKeccak256 } from 'ethers'

import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'

class ReferralStore extends State {
  @property({ value: null }) tx?: any
  @property({ value: false }) pending!: boolean
  @property({ value: '' }) address!: string

  get txPending() {
    return this.tx && !this.tx.ignored
  }
  get bound() {
    return !!bridgeStore.bridge.account && !!this.address
  }

  check = async () => {
    this.pending = true
    await getReferral()
    this.pending = false
  }
}
export const referralStore = new ReferralStore()

export const getAlbumContract = async (readonly = false) =>
  getContract('MediaBoard', { account: readonly ? undefined : await getAccount() })

export const getReferral = async () => {
  const contract = await getAlbumContract()
  try {
    referralStore.address = (await contract.agentAddress(await getAccount())) ?? ''
  } catch {}
  return referralStore.address
}

export const bindReferral = async (agentAddress: string) => {
  const contract = await getAlbumContract()
  const [method, overrides] = ['bindAgent', {}]
  const parameters = [
    agentAddress,
    solidityPackedKeccak256(['address', 'address'], [agentAddress, getContracts('MediaBoard')])
  ]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    seq: {
      type: 'Referral',
      title: `Referral`,
      ts: nowTs(),
      overrides
    }
  })
}
