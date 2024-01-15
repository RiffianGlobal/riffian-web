import { getAccount, getSigner, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { formatUnits, FixedNumber } from 'ethers'
import getMultiCall, { getMultiCallContract } from '@riffian-web/ethers/src/multiCall'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import dayjs from '~/lib/dayjs'
import { getRewardContract } from '~/lib/riffutils'

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
    title: 'Vote at least once',
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
    read: '',
    write: '',
    check: '',
    claimable: true,
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
  @property({ value: [] }) userWeeklyRewards!: UserWeekly[]
  @property({ value: [] }) weeklyPools!: bigint[]

  inited = false

  get txPending() {
    return this.tx && !this.tx.ignored
  }
  get rewardsHumanized() {
    return this.rewards
      .map((v, i) => ({
        ...rewardMap[i],
        v,
        amnt: +formatUnits(v),
        claimed: this.rewardsClaimed[i]
      }))
      .sort((r) => (r.claimed ? 1 : -1))
  }
  get weeklyPool() {
    const [pool] = this.weeklyPools
    return pool ? formatUnits(pool) : ''
  }
  get votesTotal() {
    return this.userWeeklyRewards.reduce((cur, next) => cur + (next?.reward ?? 0n), 0n)
  }
  get total() {
    return this.rewards.reduce((cur, next) => next + cur, this.votesTotal)
  }
  get totalHumanized(): string | undefined {
    if (!this.inited) return
    return (+formatUnits(this.total)).toFixed(4)
  }

  // AKA: getRewards
  update = async () => {
    this.pending = true
    try {
      const account = await getAccount()
      rewardStore.userWeeklyRewards = await getUserWeeklyRewards()

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
    } catch {}
    rewardStore.inited = true
  }
}
export const rewardStore = new RewardStore()

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
  claimed: string | number
  cooked: {
    week: number
    year: number
    past: boolean
    pastYear: boolean
    claimed: boolean
    claimable: boolean
    reward?: string | number
  }
  reward: bigint
}
export const getUserWeeklyVotes = async (account?: string): Promise<UserWeekly[]> => {
  account ||= await getAccount()
  const req = `{
    userWeeklyVotes( orderBy: "week" orderDirection: "desc" where: {user_: {address: "${account}"}} ) { week votes claimed }
  }`
  const { userWeeklyVotes } = await graphQuery('MediaBoard', req)
  const [curYear] = [dayjs().year()]
  let curWeek = dayjs().week()
  return userWeeklyVotes.map((weekly: UserWeekly, i: number) => {
    const weekday = dayjs(weekly.week * 1000)
    const [week, year, claimed] = [weekday.week(), weekday.year(), +weekly.claimed > 0]
    if (i === 0 && curWeek !== weekly.week) curWeek = week
    const [past, pastYear] = [curWeek > week, true || curYear > year]
    weekly.cooked = { week, year, past, pastYear, claimed, claimable: !claimed && past }
    return weekly
  })
}

export const getUserWeeklyRewards = async (account?: string): Promise<UserWeekly[]> => {
  const userWeeklyVotes = await getUserWeeklyVotes(account || (await getAccount()))
  const { MultiCallContract: contract, MultiCallProvider } = await getMultiCall('MediaBoard')
  // Aggregated calls
  const calls = []
  // weekly total votes
  calls.push(...userWeeklyVotes.map(({ week }) => contract.weeklyVotes(week)))
  // weekly total rewards
  calls.push(...userWeeklyVotes.map(({ week }) => contract.weeklyReward(week)))
  const [data] = await MultiCallProvider.all(calls)
  // Aggregated res
  // weekly total votes
  const weeklyVotes = data.splice(0, userWeeklyVotes.length)
  // weekly total rewards
  rewardStore.weeklyPools = data.splice(0, userWeeklyVotes.length)
  //
  const res = userWeeklyVotes.map((weekly, i) => {
    const { votes, cooked } = weekly
    weekly.reward = (rewardStore.weeklyPools[i] * BigInt(votes)) / weeklyVotes[i]
    cooked.reward = (+formatUnits(weekly.reward)).toFixed(4)
    return weekly
  })
  return res
}
