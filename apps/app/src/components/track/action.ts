import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const subjectInfo = async (addr: string) => {
  let queryJSON =
    `{
    subject(
      id: "` +
    addr +
    `"
    ) {
      address
      createdAt
      creator {
        address
        id
        rewardClaimed
        socials {
          uri
          pid
          id
          platform
        }
      }
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
  }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}

export const voters = async (addr: string) => {
  let queryJSON =
    `{
    subject(
      id: "` +
    addr +
    `"
    ) {
      address
      createdAt
      creator {
        address
        id
        rewardClaimed
        socials {
          uri
          pid
          id
          platform
        }
      }
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
      userVotes {
        volumeRetreat
        volumeTotal
        volumeVote
        votes
        user {
          address
          rewardClaimed
        }
      }
    }
  }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}
