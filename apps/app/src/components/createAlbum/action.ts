import { getAccount, getContract, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'

export const getAlbumContract = async (readonly = false) =>
  getContract('MediaBoard', { account: readonly ? undefined : await getAccount() })

export const createAlbum = async (name: string, image: string, url: string) => {
  const contract = await getAlbumContract()
  const method = 'newSubject'
  const overrides = {}
  const parameters = [name, image, url]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)

  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'CreateSubject',
      title: `Create Subject`,
      ts: nowTs(),
      overrides
    }
  })
}

export const bindSocial = async (platform: string, id: string, uri: string) => {
  const contract = await getAlbumContract()
  const method = 'bindSocial'
  const overrides = {}
  const parameters = [platform, id, uri]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)

  return new txReceipt(call, {
    errorCodes: 'MediaBoard',
    allowAlmostSuccess: true,
    seq: {
      type: 'BindSocial',
      title: `Bind Social`,
      ts: nowTs(),
      overrides
    }
  })
}

export const getSocials = async (address: string) => {
  const contract = await getAlbumContract(true)
  const method = 'getSocials'
  const parameters = [address]
  return await contract[method](...parameters)
}

export const albumData = async (album: string) => {
  const contract = await getAlbumContract(true)
  const method = 'subjectToData'
  const overrides = {}
  const parameters = [album]
  await assignOverrides(overrides, contract, method, parameters)
  return await contract[method](...parameters)
}
