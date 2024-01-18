import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

// query
export const userCreatedList = (account: String, opts = {}): Promise<any> =>
  graphQuery('MediaBoard', createdSubjectsQuery(account, opts))
export const userBasicInfo = (account: String): Promise<any> => graphQuery('MediaBoard', basicInfoQuery(account))

// query strings
export const basicInfoQuery = (account: String): string => `{
  user(id: "${account}") {
    address, holding, rewardClaimed
    socials {
      id, pid, uri, platform
    }
  }
}`
export const createdSubjectsQuery = (account: String, { first = 0, skip = 0 } = {}): string => `{
  user(id: "${account}") {
    subjectsCreated(orderBy: supply, orderDirection: desc${first > 0 ? `, first: ${first}` : ''}${
      skip > 0 ? `, ${skip}` : ''
    }) {
      address, createdAt, name, image, uri
      fansNumber, supply, totalVoteValue
      volumeTotal, volumeRetreat, volumeVote, lastVoteAt
    }
  }
}`
