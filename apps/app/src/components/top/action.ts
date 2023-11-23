import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'

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

export const votePrice = async (album: string, votes: Number) => {
  const contract = await getAlbumContract()
  const method = 'currentVotePrice'
  const overrides = {}
  const parameters = [album, votes]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}
