import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const getAlbumContract = async () => getContract('MediaBoard', { account: await getAccount() })

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

export const albumData = async (album: string) => {
  const contract = await getAlbumContract()
  const method = 'subjectToData'
  const overrides = {}
  const parameters = [album]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

export const votePrice = async (album: string) => {
  const contract = await getAlbumContract()
  const method = 'getVotePriceWithFee'
  const overrides = {}
  const parameters = [album, 1]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

export const albumList = async (count: Number) => {
  let queryJSON =
    `{
      subjects(first: ` +
    count +
    `) {
        id
        image
        name
        owner {
          account
          socials {
            platform
            uri
          }
          totalVotes
        }
        subject
        totalVotes
        updatedTimestamp
        uri
      }
    }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}
