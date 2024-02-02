import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { cookVote } from './cook'

export const trendsFrag = ({ first = 12 } = <graphParams>{}) => `
  votes: voteLogs ( first: ${first} orderBy: time orderDirection: desc) {
    id time value voter { address }
  }
`

export const subjectsReq = async (req: graphParams) => {
  const { subjects } = await graphQuery('MediaBoard', `{ ${trendsFrag(req)} }`)
  cookVote(subjects)
  return { subjects }
}
