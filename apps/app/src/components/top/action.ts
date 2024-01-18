import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { userSubjectVotes } from '../uservotes/action'
import { subjectWeeklyVotesQuery as weeklyVotes, subjectsQuery } from '~/query'

export const getAlbumContract = async (readonly = false) =>
  getContract('MediaBoard', { account: readonly ? undefined : await getAccount() })

export const vote = async (album: string, amount: number, price: object) => {
  const contract = await getAlbumContract()
  const method = 'vote'
  const overrides = {}
  const parameters = [album, amount, price]

  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'VoteSubject',
      title: `Vote Subject`,
      ts: nowTs(),
      overrides
    }
  })
}

export const getSocials = async (addr: string) => {
  try {
    const contract = await getAlbumContract(true)
    const method = 'getSocials'
    const parameters = [addr]
    const socials = await contract[method](...parameters)
    let uri = socials[0][2]
    return uri
  } catch (err: any) {
    console.log(err)
  }
}

export const retreat = async (album: string, amount: number) => {
  const contract = await getAlbumContract()
  const method = 'retreat'
  const overrides = {}
  const parameters = [album, amount]

  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'RetreatSubject',
      title: `Retreat Subject`,
      ts: nowTs(),
      overrides
    }
  })
}

export const albumData = async (album: string) => {
  const contract = await getAlbumContract(true)
  const method = 'subjectToData'
  const overrides = {}
  const parameters = [album]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

export const myVotes = async (album: string) => {
  return userSubjectVotes(album, await getAccount())
}

export const retreatPrice = async (album: string) => {
  try {
    const contract = await getAlbumContract(true)
    const method = 'getRetreatPrice'
    const parameters = [album, 1]
    return await contract[method](...parameters)
  } catch (err) {
    return 0
  }
}

export const votePrice = async (album: string) => {
  const contract = await getAlbumContract(true)
  const method = 'getVotePrice'
  const parameters = [album, 1]
  return await contract[method](...parameters)
}

export const votePriceWithFee = async (album: string) => {
  const contract = await getAlbumContract(true)
  const method = 'getVotePriceWithFee'
  const overrides = {}
  const parameters = [album, 1]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

export const weekList = async (week: BigInt, { first, skip } = {}) => {
  const daySeconds = 24n * 60n * 60n
  let time = BigInt(new Date().getTime()) / 1000n - daySeconds
  return weeklyVotes(week, time, { first, skip })
}

export const albumList = async ({ first = 0, skip = 0 } = {}) => {
  const daySeconds = 24n * 60n * 60n
  let time = BigInt(new Date().getTime()) / 1000n - daySeconds
  return subjectsQuery(time, { first, skip })
}
