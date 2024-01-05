import {
  getAccount,
  bridgeStore,
  getSigner,
  getContract,
  getContracts,
  assignOverrides
} from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'

import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'

class RewardStore extends State {
  @property({ value: null }) tx?: any
  @property({ value: false }) pending!: boolean
  @property({ value: '' }) total!: number | ''

  get txPending() {
    return this.tx && !this.tx.ignored
  }

  check = async () => await rewards()
}
export const rewardStore = new RewardStore()

export const getAlbumContract = async (readonly = false) =>
  getContract('Reward', { account: readonly ? undefined : await getAccount() })

// TODO: MultiCall
export const rewards = async () => {
  const contract = await getAlbumContract()

  const [res1 = '', res2 = ''] = await Promise.all([
    contract.RewardSocialVerify(),
    contract.RewardVote(),
    contract.RewardFollow(),
    contract.RewardShare()
  ])
  console.log('rewards', res1, res2)
  try {
    rewardStore.total = res1
  } catch {
    rewardStore.total = ''
  }
  return rewardStore.total
}

// TODO: MultiCall
export const claimed = async () => {
  const contract = await getAlbumContract()
  const [res1, res2] = await Promise.all([contract.isSocialVerifyClaimed(), contract.isVotingClaimed()])
  console.log('claimed', res1, res2)
  return [res1, res2]
}

export const claim = async () => {
  const signer = await getSigner()
  const secret = await signer.signMessage('')

  const contract = await getAlbumContract()
  const [method, overrides] = ['claimSocialVerify', {}]
  const parameters = [secret]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  return new txReceipt(call, {
    errorCodes: 'Reward',
    seq: {
      type: 'Reward',
      title: `Reward`,
      ts: nowTs(),
      overrides
    }
  })
}
