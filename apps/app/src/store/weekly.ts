import { State, property } from '@lit-web3/base/state'
import dayjs from '~/lib/dayjs'
export { StateController } from '@lit-web3/base/state'
import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { weekSeconds } from '~/constants'
import { getAlbumContract } from '~/lib/riffutils'

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
    if (!this.promise) {
      this.promise = new Promise(async (resolve) => {
        let week
        const { statistic } = await graphQuery('MediaBoard', `{ statistic (id: "riffian") { week } }`)
        week = statistic?.week
        // Add week offset due to initial time elapsed too long
        if (!week) {
          const weekBigInt = await (await getAlbumContract()).startTimeStamp()
          const tsNow = BigInt(dayjs().unix())
          week = Number(tsNow - ((tsNow - weekBigInt) % BigInt(weekSeconds)))
        }
        const [nextStart, now] = [week + weekSeconds, dayjs().unix()]
        // GraphData maybe not update if no new events
        if (now > nextStart) while (week + weekSeconds < now) week += weekSeconds
        this.latestEnd = week + weekSeconds
        const [start, end] = [dayjs.unix(week), dayjs.unix(this.latestEnd)]
        let [startMonth, endMonth] = [start.format('MMM'), end.format('MMM')]
        if (startMonth === endMonth) endMonth = ''
        this.latestRange = `${startMonth}${start.format('D')}-${endMonth}${end.format('D')} ${end.format('YYYY')}`
        resolve((this.latest = week))
        this.cd()
      })
    }
    return this.promise
  }
  cd = () => {
    const [end, now] = [dayjs.unix(this.latestEnd), dayjs()]
    if (end <= now) this.getLatest()
    var diff = dayjs.duration(end.diff(now))
    const [h, m, s] = [diff.days() * 24 + diff.hours(), diff.minutes(), diff.seconds()].map((r) =>
      r.toString().padStart(2, '0')
    )
    this.latestLeft = `${h}:${m}:${s}`
    setTimeout(this.cd, 1000)
  }
}
export const weeklyStore = new WeeklyStore()
