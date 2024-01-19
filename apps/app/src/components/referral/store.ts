import { getAccount, bridgeStore, getContract, getContracts, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { solidityPackedKeccak256 } from 'ethers'
import { getAlbumContract } from '~/lib/riffutils'

import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'

class ReferralStore extends State {
  @property({ value: '' }) address!: string
  @property({ value: false }) inited!: boolean

  get bound() {
    return this.inited && !!bridgeStore.bridge.account && !!this.address
  }

  get = async () => {
    if (!this.address) {
      const contract = await getAlbumContract()
      try {
        const res = await contract.agentAddress(await getAccount())
        if (res && +res !== 0) this.address = res
      } catch {}
    }
    this.inited = true
    return this.address
  }

  set = async (agentAddress: string) => {
    try {
      const contract = await getAlbumContract()
      const [method, overrides] = ['bindAgent', {}]
      const parameters = [
        agentAddress,
        solidityPackedKeccak256(['address', 'address'], [agentAddress, getContracts('MediaBoard')])
      ]
      await assignOverrides(overrides, contract, method, parameters)
      const call = contract[method](...parameters)
      const tx = new txReceipt(call, {
        errorCodes: 'MediaBoard',
        seq: {
          type: 'Referral',
          title: `Referral`,
          ts: nowTs(),
          overrides
        }
      })
      await tx.wait(true)
      this.address = agentAddress
    } catch (err) {
      throw err
    }
  }
}
export const referralStore = new ReferralStore()
