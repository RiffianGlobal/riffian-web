import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const tracks = async (addr: string) => {
  let queryJSON =
    `{
      user(id: "` +
    addr +
    `") {
        address
        holding
        id
        rewardClaimed
        socials {
          id
          pid
          platform
          uri
        }
        subjectsCreated {
          address
          createdAt
          fansNumber
          id
          image
          lastVoteAt
          name
          supply
          totalVoteValue
          uri
          volumeRetreat
          volumeTotal
          volumeVote
        }
      }
    }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}

export const user = async (addr: string) => {
  let queryJSON =
    `{
      user(id: "` +
    addr +
    `") {
        address
        holding
        id
        rewardClaimed
        socials {
          id
          pid
          platform
          uri
        }
      }
    }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}
