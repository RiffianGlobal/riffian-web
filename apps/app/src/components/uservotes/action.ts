import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { getAlbumContract } from '~/lib/riffutils'
import { cookSubject } from '~/query/cook'

export const retreatPrice = async (album: string, amount: number) => {
  const contract = await getAlbumContract(true)
  const method = 'getRetreatPrice'
  const overrides = {}
  const parameters = [album, amount]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

/**
 * get user's voting info of one subject
 * @param subject subject id
 * @param address user address
 * @returns
 */
export const userSubjectVotes = async (subject: string, address: string): Promise<bigint> => {
  const contract = await getAlbumContract(true)
  return await contract.userSubjectVotes(subject, address)
}

/**
 * retreat votes
 * @param subject subject id
 * @param amount number of votes
 * @returns
 */
export const retreat = async (subject: string, amount: number) => {
  const contract = await getAlbumContract()
  const method = 'retreat'
  const overrides = {}
  const parameters = [subject, amount]

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

export const userVotes = async (addr?: string, { orderBy = '', dir = '' } = {}) => {
  if (!addr) addr = await getAccount()
  if (!addr) return []
  orderBy ||= 'holding'
  dir ||= 'desc'
  let queryJSON = `{
    userSubjectVotes ( where: { holding_gt: 0, user: "${addr.toLowerCase()}" } orderBy: "${orderBy}" orderDirection: "${dir}") {
      holding votes subject { id name image uri supply creator { address } }
    }
  }`
  const { userSubjectVotes: subjects = [] } = await graphQuery('MediaBoard', queryJSON)
  cookSubject(subjects)
  return { subjects }
}
