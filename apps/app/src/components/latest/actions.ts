import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const latestVote = async (count: Number) => {
  let queryJSON = `{
      voteLogs(first: ${count}, orderBy: time, orderDirection:desc) {
        id
        voter{
          address
        }
        time
        value
      }
    }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}
