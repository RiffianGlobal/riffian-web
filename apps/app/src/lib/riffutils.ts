import { getContract, getAccount } from '@riffian-web/ethers/src/useBridge'
// Components
export { toast } from '@riffian-web/ui/toast'

export const getAlbumContract = async (readonly = false) =>
  getContract('MediaBoard', { account: readonly ? undefined : await getAccount() })

export const getRewardContract = async (account?: string) =>
  getContract('Reward', { account: account ?? (await getAccount()) })
