import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { cookSubject, cookVote } from './cook'
import { subjectsFrag } from './subjects'
import { weeklySubjectsFrag } from './subjects-weekly'
import { votesFrag } from './votes'

export const chartsReq = async (req: graphParams) => {
  const { subjects, weeklySubjects, votes } = await graphQuery(
    'MediaBoard',
    `{ ${weeklySubjectsFrag(req)} ${subjectsFrag(req)} ${votesFrag(req)} }`
  )
  cookSubject(subjects)
  cookSubject(weeklySubjects)
  cookVote(weeklySubjects)
  return { subjects, weeklySubjects, votes }
}
