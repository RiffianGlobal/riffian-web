import { getContract, getAccount } from '@riffian-web/ethers/src/useBridge'
// Components
export { toast } from '@riffian-web/ui/toast'

export const getAlbumContract = async (account?: string) =>
  getContract('MediaBoard', { account: account ?? (await getAccount()) })

export const getRewardContract = async (account?: string) =>
  getContract('Reward', { account: account ?? (await getAccount()) })
