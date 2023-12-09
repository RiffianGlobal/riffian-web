import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'

export const getAlbumContract = async () => getContract('MediaBoard', { account: await getAccount() })

/**
 * claim weekly rewards
 * @param album
 * @returns
 */
export const claimRewards = async () => {
  const contract = await getAlbumContract()
  const method = 'claimReward'
  const overrides = {}
  const parameters = [getWeek()]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)

  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'ClaimAlbumRewards',
      title: `Claim Album Rewards`,
      ts: nowTs(),
      overrides
    }
  })
}

/**
 * uint256 reward = (weeklyReward[week] * userWeeklyVotes[msg.sender][week]) / weeklyVotes[_week];
 */
export const userWeeklyReward = async (addr: string) => {
  const contract = await getAlbumContract()
  const week = await getWeek()
  const method = 'userWeeklyVotes'
  const parameters = [addr, week]
  let userWeeklyVotes = await contract[method](...parameters)
  const method1 = 'weeklyVotes'
  const para = [week]
  let weeklyVotes = await contract[method1](...para)
  if (weeklyVotes == 0n) {
    return 0
  }
  let weeklyRewards = await weeklyReward()
  return (weeklyRewards * userWeeklyVotes) / weeklyVotes
}

/**
 * get weekly rewards
 * @param album
 * @returns
 */
export const weeklyReward = async () => {
  const contract = await getAlbumContract()
  const method = 'weeklyReward'
  const parameters = [getWeek()]
  return await contract[method](...parameters)
}

var weekBegin = 0n

/**
 * calculate week begin time
 * @returns week begin time in seconds
 */
export const getWeek = async () => {
  if (weekBegin != 0n) return weekBegin
  const contract = await getAlbumContract()
  const method = 'startTimeStamp'
  let tsStart = await contract[method]()
  const weekSeconds = 7n * 24n * 60n * 60n
  let tsNow = BigInt(new Date().getTime()) / 1000n
  weekBegin = tsNow - ((tsNow - tsStart) % weekSeconds)
  return weekBegin
}
