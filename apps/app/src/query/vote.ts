import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const subjectWeeklyVotesQuery = (week: String, voteTime: String, { first = 0, skip = 0 } = {}): Promise<any> => {
  let query = `{
    subjectWeeklyVotes(
      where: { week: ${week} }${first > 0 ? ` ,first: ${first}` : ''}${skip > 0 ? ` ,skip: ${skip}` : ''}
      orderBy: volumeTotal, orderDirection: desc
    ) {
      id
      volumeTotal
      subject {
        id, name, image, uri, supply
        creator {
          address
        }
        voteLogs(
          first: 1
          where: { time_lt: ${voteTime.toString()} } 
          orderBy: time, orderDirection: desc
        ) {
          supply
        }
      }
    }
  }`
  return graphQuery('MediaBoard', query)
}
