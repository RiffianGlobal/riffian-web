import { formatUnits, parseUnits } from 'ethers'
import emptyCoverUri from '~/assets/empty.webp?inline'
import { format } from '~/lib/dayjs'

export const cookSubject = (res = []) => {
  ;[res].flat().forEach((subject: any) => {
    if (subject.subject) {
      Object.assign(subject, subject.subject)
      delete subject.subject
    }
    const { image, supply, voteLogs = [], creator = {}, createdAt } = subject
    // Normalize
    const totalBN = subject.totalVoteValue ?? subject.volumeTotal
    // Change daily
    const [newer, chg] = [!voteLogs.length, { val: 0n, rate: '1', per: '', stat: '' }]
    if (newer) {
      chg.per = 'New'
    } else {
      const [cur, prev] = [parseUnits(supply), parseUnits(voteLogs[0].supply)]
      const diff = cur - prev
      chg.val = diff
      chg.rate = formatUnits((diff * parseUnits('100')) / prev)
      if (diff !== 0n) chg.stat = diff > 0 ? 'up' : 'down'
      chg.per = diff == 0n ? '-' : `${diff > 0 ? '+' : '-'}${parseFloat(chg.rate.toString()).toFixed(1)}%`
    }

    subject.cooked = {
      totalBN,
      total: totalBN ? +formatUnits(totalBN).toString() : '',
      src: image?.startsWith(`http`) ? image : emptyCoverUri,
      chg,
      newer,
      address: creator.address,
      price: (+supply + 1) / 10,
      date: createdAt ? format(createdAt) : ''
    }
  })
  return res
}

export const cookVote = (res = []) => {
  // ;[res].flat().forEach((vote: any) => {
  //   vote.cooked = {}
  // })
  return res
}
