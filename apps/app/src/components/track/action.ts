import { graphQuery } from '@riffian-web/ethers/src/constants/graph'

export const subjectInfo = async (addr: string) => {
  let queryJSON = `{
    subject ( id: "${addr.toLowerCase()}" ) {
      address createdAt
      fansNumber id image lastVoteAt name supply totalVoteValue
      uri volumeRetreat volumeTotal volumeVote
      creator {
        address id rewardClaimed
        socials { uri pid id platform }
      }
    }
  }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}

export const trackVotes = async (addr: string, orderBy = 'volumeTotal') => {
  let queryJSON = `{
    subject ( id: "${addr.toLowerCase()}" ) {
      address createdAt volumeTotal volumeVote
      fansNumber id image lastVoteAt name supply totalVoteValue uri volumeRetreat 
      creator {
        address id rewardClaimed socials { uri pid id platform }
      }
      userVotes (orderBy: "${orderBy}" orderDirection: "desc" ) {
        volumeRetreat volumeTotal volumeVote votes
        user { address rewardClaimed }
      }
    }
  }`
  let result = await graphQuery('MediaBoard', queryJSON)
  return result
}
