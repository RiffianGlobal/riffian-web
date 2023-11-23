import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'

export const getAlbumContract = async () => getContract('MediaBoard', { account: await getAccount() })

export const claimDailyRewards = async () => {
  const contract = await getAlbumContract()
  const method = 'claimDailyRewards'
  const overrides = {}
  await assignOverrides(overrides, contract, method)
  const call = contract[method]()

  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'ClaimDailyRewards',
      title: `Claim Daily Rewards`,
      ts: nowTs(),
      overrides
    }
  })
}

export const claimAlbumRewards = async (album: string) => {
  const contract = await getAlbumContract()
  const method = 'claimAlbumRewards'
  const overrides = {}
  const parameters = [album]
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

export const calculateAlbumRewards = async (account: string, album: string) => {
  const contract = await getAlbumContract()
  const method = 'calculateAlbumRewards'
  const overrides = {}
  const parameters = [account, album]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}

export const calculateDailyRewards = async (account: string) => {
  const contract = await getAlbumContract()
  const method = 'calculateDailyRewards'
  const overrides = {}
  const parameters = [account]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}
