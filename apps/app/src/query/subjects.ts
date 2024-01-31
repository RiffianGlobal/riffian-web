import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { onedayAgo } from '~/lib/riffutils'
import { cookSubject } from './cook'

export const subjectsFrag = ({ time = onedayAgo(), first = 10, skip = 0 } = <graphParams>{}) => `
  subjects (
    where: { creator_starts_with: "0x" }${first ? ` first: ${first}` : ''}${skip ? ` skip: ${skip}` : ''}
    orderBy: supply orderDirection: desc
  ) {
    id image name uri supply createdAt totalVoteValue creator { address }
    voteLogs ( first: 1 where: { time_lt: ${time + ''} } orderBy: time orderDirection: desc ) { supply }
  }
`

export const subjectsReq = async (req: graphParams) => {
  const { subjects } = await graphQuery('MediaBoard', `{ ${subjectsFrag(req)} }`)
  cookSubject(subjects)
  return { subjects }
}
