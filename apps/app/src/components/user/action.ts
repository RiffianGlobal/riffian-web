import { userCreatedList, userBasicInfo } from '~/query/user'
import { cookSubject } from '~/query/cook'

export const tracks = async (addr: string) => {
  const { subjectsCreated: subjects = [] } = (await userCreatedList(addr))?.user ?? {}
  cookSubject(subjects)
  return { subjects }
}
export const user = async (addr: string) => await userBasicInfo(addr)
