import { getAccount, getSigner, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { formatUnits } from 'ethers'
import getMultiCall from '@riffian-web/ethers/src/multiCall'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import dayjs from '~/lib/dayjs'
import { getRewardContract } from '~/lib/riffutils'
import { weeklyStore } from '~/store/weekly'
import { tweetStore } from '~/store/tweet'

import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'

export const rewardMap = [
  {
    key: 'social',
    title: 'Bind a social account',
    read: 'RewardSocialVerify',
    write: 'claimSocialVerify',
    requireSig: true,
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
  {
    key: 'follow',
    title: 'Follow',
    read: 'RewardFollow',
    write: 'claimFollow',
    requireSig: true,
    check: 'followClaimed',
    closed: true
  },
  {
    key: 'share',
    title: 'Share',
    read: 'RewardShare',
    write: 'claimShare',
    requireSig: true,
    check: 'shareClaimed',
    closed: true
  }
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
  @property({ value: false }) inited!: boolean
  @property({ value: [] }) rewards!: bigint[]
  @property({ value: [] }) tasks!: bigint[]
  @property({ value: [] }) rewardsClaimed!: boolean[]
  @property({ value: [] }) userWeeklyRewards!: UserWeekly[]
  @property({ value: [] }) userWeeklyPools!: bigint[]
  @property({ value: 0n }) weeklyPool!: bigint // current weekly pool

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
  get weeklyPoolHumanized() {
    return this.weeklyPool ? formatUnits(this.weeklyPool) : ''
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
  get socialNotClaimed() {
    return this.inited && this.rewardsClaimed[0] === false
  }

  // AKA: getRewards
  update = async () => {
    this.pending = true
    tweetStore.fetchSelf()
    try {
      const account = await getAccount()
      rewardStore.userWeeklyRewards = await getUserWeeklyRewards(account)

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
    weekOrdinal: string
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
    userWeeklyVotes( orderBy: "week" orderDirection: "desc" where: {user_: {address: "${account!.toLowerCase()}"}} ) { week votes claimed }
  }`
  const { userWeeklyVotes } = await graphQuery('MediaBoard', req)
  const [curYear] = [dayjs().year()]
  let curWeek = dayjs().week()
  return userWeeklyVotes.map((weekly: UserWeekly, i: number) => {
    const weekday = dayjs.unix(weekly.week)
    const [week, year, claimed] = [weekday.week(), weekday.year(), +weekly.claimed > 0]
    const [past, pastYear] = [curWeek > week, true || curYear > year]
    weekly.cooked = {
      week,
      weekOrdinal: weekday.format('wo'),
      year,
      past,
      pastYear,
      claimed,
      claimable: !claimed && past
    }
    return weekly
  })
}

export const getUserWeeklyRewards = async (account?: string): Promise<UserWeekly[]> => {
  const currentWeek = await weeklyStore.getLatest()
  const userWeeklyVotes = await getUserWeeklyVotes(account || (await getAccount()))
  const weekN = userWeeklyVotes.length
  const { MultiCallContract: contract, MultiCallProvider } = await getMultiCall('MediaBoard')
  // Aggregated calls
  // 0: current weekly pool
  const calls = [contract.weeklyReward(currentWeek)]
  // 0-weekN: weekly total votes
  calls.push(...userWeeklyVotes.map(({ week }) => contract.weeklyVotes(week)))
  // 0-weekN: weekly total rewards
  calls.push(...userWeeklyVotes.map(({ week }) => contract.weeklyReward(week)))
  const [data] = await MultiCallProvider.all(calls)
  // Aggregated res
  // 0: current weekly pool
  rewardStore.weeklyPool = data.shift()
  // weekly total votes
  const weeklyVotes = data.splice(0, weekN)
  // weekly total rewards
  rewardStore.userWeeklyPools = data.splice(0, weekN)
  //
  const res = userWeeklyVotes.map((weekly, i) => {
    const { votes, cooked } = weekly
    weekly.reward = (rewardStore.userWeeklyPools[i] * BigInt(votes)) / weeklyVotes[i]
    cooked.reward = (+formatUnits(weekly.reward)).toFixed(4)
    return weekly
  })
  return res
}
