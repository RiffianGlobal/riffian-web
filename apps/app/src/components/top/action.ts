import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const getAlbumContract = async () => getContract('MediaBoard', { account: await getAccount() })

export const vote = async (album: string, price: object) => {
  const contract = await getAlbumContract()
  const method = 'vote'
  const overrides = {}
  const parameters = [album, price]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)

  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'VoteAlbum',
      title: `Vote Album`,
      ts: nowTs(),
      overrides
    }
  })
}

export const albumData = async (album: string) => {
  const contract = await getAlbumContract()
  const method = 'albumToData'
  const overrides = {}
  const parameters = [album]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

export const votePrice = async (album: string) => {
  const contract = await getAlbumContract()
  const method = 'calculateAlbumVotePrice'
  const overrides = {}
  const parameters = [album]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

export const albumList = async (count: Number) => {
  let queryJSON =
    `{
    albums(first: ` +
    count +
    `, orderBy: rewardPoolAmount, orderDirection: asc) {
      id
      address
      totalVotes
      rewardPoolAmount
      fansNumber
      createdAt
      artist {
        address
        totalRewards
        totalVotes
      }
    }
  }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}
