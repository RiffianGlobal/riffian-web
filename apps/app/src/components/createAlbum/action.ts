import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'

export const getAlbumContract = async () => getContract('MediaBoard', { account: await getAccount() })

export const createAlbum = async (album: string, symbol: string) => {
  const contract = await getAlbumContract()
  const method = 'newAlbum'
  const overrides = {}
  const parameters = [album, symbol]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)

  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'CreateAlbum',
      title: `Create Album`,
      ts: nowTs(),
      overrides
    }
  })
}
