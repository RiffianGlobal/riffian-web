import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const getAlbumContract = async () => getContract('MediaBoard', { account: await getAccount() })

export const retreatPrice = async (album: string, amount: number) => {
  const contract = await getAlbumContract()
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
export const userSubjectVotes = async (subject: string, address: string) => {
  const contract = await getAlbumContract()
  const method = 'userSubjectVotes'
  const overrides = {}
  const parameters = [subject, address]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
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

export const userVotes = async (addr: string) => {
  let queryJSON =
    `{
      userVotes(
        where: {voter_: {account: "` +
    addr +
    `"}}
      ) {
        amount
        id
        isVote
        updatedBlock
        subject {
          id
          image
          name
          owner {
            account
            id
          }
        }
        supply
        value
      }
    }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}
