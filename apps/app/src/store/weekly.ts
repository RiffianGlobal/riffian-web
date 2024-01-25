import { State, property } from '@lit-web3/base/state'
import dayjs from '~/lib/dayjs'
export { StateController } from '@lit-web3/base/state'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { weekSeconds } from '~/constants'
import { nowTs } from '@riffian-web/ethers/src/utils'

class WeeklyStore extends State {
  @property({ value: '' }) latest!: number
  @property({ value: '' }) latestEnd!: number
  @property({ value: '' }) latestLeft!: string
  @property({ value: '' }) latestRange!: string

  constructor() {
    super()
    this.getLatest()
  }

  promise: any
  getLatest = async () => {
    if (!this.promise)
      this.promise = new Promise(async (resolve) => {
        let {
          statistic: { week }
        } = await graphQuery('MediaBoard', `{ statistic (id: "riffian") { week } }`)
        const nextStart = week + weekSeconds
        if (nowTs() > nextStart * 1000) week = nextStart // GraphData maybe not update if not new events
        this.latestEnd = week + weekSeconds
        const [start, end] = [dayjs.unix(week), dayjs.unix(this.latestEnd)]
        let [startMonth, endMonth] = [start.format('MMM'), end.format('MMM')]
        if (startMonth === endMonth) endMonth = ''
        this.latestRange = `${startMonth}${start.format('D')}-${endMonth}${end.format('D')} ${end.format('YYYY')}`
        resolve((this.latest = week))
        this.cd()
      })
    return this.promise
  }
  cd = () => {
    const end = dayjs.unix(this.latestEnd)
    var diff = dayjs.duration(end.diff(dayjs()))
    const [h, m, s] = [diff.days() * 24 + diff.hours(), diff.minutes(), diff.seconds()].map((r) =>
      r.toString().padStart(2, '0')
    )
    this.latestLeft = `${h}:${m}:${s}`
    setTimeout(this.cd, 1000)
  }
}
export const weeklyStore = new WeeklyStore()
