import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { onedayAgo} from '~/lib/riffutils'
import { cookSubject } from './cook'

/*
Top: sort by price
New: sort by create time
Trending: sort by 24h volume
*/
const orderMap: Record<string, string> = {
  top: 'supply',
  new: 'createdAt',
  trending: 'volumeTotal' // 24h vol
}
export const subjectsFrag = (
  { cate = 'top', time = onedayAgo(), first = 10, skip = 0, keyword = '' , filterTime = '', filterPrice = '' } = <graphParams>{}
) => {
  return `
  subjects (
    where: {
      creator_starts_with: "0x"
      ${keyword ? ` name_contains_nocase: "${keyword}"` : ''}
      ${filterTime}
      ${filterPrice}
    } ${first ? ` first: ${first}` : ''}${skip ? ` skip: ${skip}` : ''}
    orderBy: ${orderMap[cate]} orderDirection: desc
  ) {
    id image name uri supply createdAt totalVoteValue volumeTotal creator { address }
    voteLogs ( first: 1 where: { time_lt: ${time + ''} } orderBy: time orderDirection: desc ) { supply }
  }
`
}

export const subjectsReq = async (req: graphParams) => {
  const query = `{ ${subjectsFrag(req)} }`
  const { subjects } = await graphQuery('MediaBoard', query)
  cookSubject(subjects)
  return { subjects }
}
