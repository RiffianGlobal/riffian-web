import { userCreatedList, userBasicInfo } from '~/query/user'

export const tracks = async (addr: string) => await userCreatedList(addr)
export const user = async (addr: string) => await userBasicInfo(addr)
