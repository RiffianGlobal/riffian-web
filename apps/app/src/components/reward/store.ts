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
import { formatUnits } from 'ethers'

import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'

export const rewardMap = [
  {
    key: 'social',
    title: 'Social Verification',
    read: 'RewardSocialVerify',
    write: 'claimSocialVerify',
    claimable: false
  },
  { key: 'vote', title: 'Vote', read: 'RewardVote', write: 'claimVote', claimable: false },
  { key: 'follow', title: 'Follow', read: 'RewardFollow', write: 'claimFollow', claimable: false },
  { key: 'share', title: 'Share', read: 'RewardShare', write: 'claimShare', claimable: false }
]

class RewardStore extends State {
  @property({ value: null }) tx?: any
  @property({ value: false }) pending!: boolean
  @property({ value: [] }) rewards!: bigint[]
  @property({ value: [] }) rewardsClaimable!: boolean[]

  get txPending() {
    return this.tx && !this.tx.ignored
  }
  get rewardsHumanized() {
    return this.rewards.map((v, i) => ({
      ...rewardMap[i],
      v,
      amnt: formatUnits(v),
      claimable: this.rewardsClaimable[i]
    }))
  }
  get total() {
    return this.rewards.reduce((next, cur) => next + cur, 0n)
  }
  get totalHumanized() {
    return formatUnits(this.total)
  }

  update = async () => await getRewards()
}
export const rewardStore = new RewardStore()

export const getRewardContract = async (account?: string) =>
  getContract('Reward', { account: account ?? (await getAccount()) })

// TODO: MultiCall
export const getRewards = async () => {
  const account = await getAccount()
  const contract = await getRewardContract(account)

  // TODO: MultiCall
  const calls: any[] = [...rewardMap.map((r) => contract[r.read]())]
  calls.push(...[contract.isSocialVerifyClaimed(account), contract.isVotingClaimed(account)])
  const res = await Promise.all(calls)
  rewardStore.rewards = res.splice(0, rewardMap.length)
  rewardStore.rewardsClaimable = [!res.shift(), true, true, true]
}

// TODO: MultiCall
export const claimed = async () => {
  const contract = await getRewardContract()
  const [res1, res2] = await Promise.all([contract.isSocialVerifyClaimed(), contract.isVotingClaimed()])
  return [res1, res2]
}

export const claim = async () => {
  const signer = await getSigner()
  const secret = await signer.signMessage('')

  const contract = await getRewardContract()
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
