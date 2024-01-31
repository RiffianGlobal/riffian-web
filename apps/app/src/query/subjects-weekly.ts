import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { onedayAgo } from '~/lib/riffutils'
import { cookSubject } from './cook'

export const weeklySubjectsFrag = ({ week, time = onedayAgo(), first = 10, skip = 0 } = <graphParams>{}) => `
  weeklySubjects: subjectWeeklyVotes (
    where: { week: ${week} }${first ? ` first: ${first}` : ''}${skip ? ` skip: ${skip}` : ''}
    orderBy: volumeTotal orderDirection: desc
  ) {
    id volumeTotal
    subject {
      id name image uri supply creator { address }
      voteLogs ( first: 1 where: { time_lt: ${time + ''} } orderBy: time orderDirection: desc ) { supply }
    }
  }
`

export const weeklySubjectsReq = async (req: graphParams) => {
  const { weeklySubjects } = await graphQuery('MediaBoard', `{ ${weeklySubjectsFrag(req)} }`)
  cookSubject(weeklySubjects)
  return { weeklySubjects }
}
