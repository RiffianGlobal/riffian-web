import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const subjectsQuery = (time: string, { first = 10, skip = 0 } = {}): Promise<any> => {
  let query = `{
    subjects(
      where: { creator_starts_with: "0x" }${first > 0 ? `, first: ${first}` : ''}${skip > 0 ? `, skip: ${skip}` : ''}
      orderBy: supply, orderDirection: desc
    ) {
      id, image, name, uri, supply, createdAt, totalVoteValue
      creator {
        address
      }
      voteLogs(
        first: 1
        where: { time_lt: ${time} }
        orderBy: time, orderDirection: desc
      ) {
        supply
      }
    }
  }`
  return graphQuery('MediaBoard', query)
}
