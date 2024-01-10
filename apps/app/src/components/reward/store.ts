import { getAccount, getSigner, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { formatUnits, FixedNumber } from 'ethers'
import getMultiCall, { getMultiCallContract } from '@riffian-web/ethers/src/multiCall'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'

export const rewardMap = [
  {
    key: 'social',
    title: 'Bind a social account',
    read: 'RewardSocialVerify',
    write: 'claimSocialVerify',
    check: 'isSocialVerifyClaimed',
    once: true,
    closed: false
  },
  {
    key: 'vote',
    title: 'Voted at least once',
    read: 'RewardVote',
    write: 'claimVote',
    check: 'isVotingClaimed',
    once: true,
    closed: false
  },
  { key: 'follow', title: 'Follow', read: 'RewardFollow', write: 'claimFollow', check: 'followClaimed', closed: true },
  { key: 'share', title: 'Share', read: 'RewardShare', write: 'claimShare', check: 'shareClaimed', closed: true }
]

export const rewardTasks = [
  {
    key: 'votes',
    title: 'Weekly Votes',
    read: 'RewardSocialVerify',
    write: 'claimSocialVerify',
    check: 'isSocialVerifyClaimed',
    closed: false
  },
  ...rewardMap
]

class RewardStore extends State {
  @property({ value: null }) tx?: any
  @property({ value: false }) pending!: boolean
  @property({ value: [] }) rewards!: bigint[]
  @property({ value: [] }) tasks!: bigint[]
  @property({ value: [] }) rewardsClaimed!: boolean[]
  @property({ value: [] }) weeklies!: UserWeekly[]

  inited = false

  get txPending() {
    return this.tx && !this.tx.ignored
  }
  get rewardsHumanized() {
    return this.rewards.map((v, i) => ({
      ...rewardMap[i],
      v,
      amnt: +formatUnits(v),
      claimed: this.rewardsClaimed[i]
    }))
  }
  get total() {
    const weeklies = this.weeklies.reduce((cur, next) => cur + (next?.reward ?? 0n), 0n)
    return this.rewards.reduce((cur, next) => next + cur, weeklies)
  }
  get totalHumanized() {
    if (!this.inited) return 0
    return (+formatUnits(this.total)).toFixed(4)
  }

  update = async () => await getRewards()
}
export const rewardStore = new RewardStore()

export const getRewardContract = async (account?: string) =>
  getContract('Reward', { account: account ?? (await getAccount()) })

export const getRewards = async () => {
  const account = await getAccount()
  rewardStore.weeklies = await userWeeklyRewards()

  const { MultiCallContract: rewardContract, MultiCallProvider } = await getMultiCall('Reward')
  // Aggregated calls
  // 0: claimable amnts
  const calls = [rewardContract.claimable(account)]
  // 1-4: Task max amnts
  calls.push(...rewardMap.map((r) => rewardContract[r.read]()))
  // 5-8: isClaimed
  calls.push(...rewardMap.map((r) => rewardContract[r.check](account)))
  const [res] = await MultiCallProvider.all(calls)
  // Aggregated res
  // 0: claimable amnts
  rewardStore.rewards = res.shift().map((v: bigint, i: number) => (rewardMap[i].closed ? 0n : v))
  // 1-4: Task max amnts
  rewardStore.tasks = res.splice(0, rewardMap.length)
  // 5-8: isClaimed
  rewardStore.rewardsClaimed = res.splice(0, rewardMap.length)
  rewardStore.inited = true
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

export type UserWeekly = {
  week: number
  votes: string
  reward?: bigint
}
export const getUserWeeklies = async (account?: string): Promise<UserWeekly[]> => {
  account ||= await getAccount()
  const { userWeeklyVotes } = await graphQuery(
    'MediaBoard',
    `{ userWeeklyVotes( where: {user_: {address: "${account}"}} ) { week votes } }`
  )
  return userWeeklyVotes
}

export const userWeeklyRewards = async (account?: string): Promise<UserWeekly[]> => {
  const userWeeklies = await getUserWeeklies(account || (await getAccount()))
  const { MultiCallContract: contract, MultiCallProvider } = await getMultiCall('MediaBoard')
  // Aggregated calls
  const calls = []
  // weekly total votes
  calls.push(...userWeeklies.map(({ week }) => contract.weeklyVotes(week)))
  // weekly total rewards
  calls.push(...userWeeklies.map(({ week }) => contract.weeklyReward(week)))
  const [data] = await MultiCallProvider.all(calls)
  // Aggregated res
  // weekly total votes
  const weeklyVotes = data.splice(0, userWeeklies.length)
  // weekly total rewards
  const weeklyRewards = data.splice(0, userWeeklies.length)
  //
  const res = userWeeklies.map((weekly, i) => {
    const { votes } = weekly
    const reward = (weeklyRewards[i] * BigInt(votes[i])) / weeklyVotes[i]
    return { ...weekly, reward }
  })
  return res
}
