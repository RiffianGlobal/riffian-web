import { default as dayjs } from 'dayjs'
import { default as weekOfYear } from 'dayjs/plugin/weekOfYear'
import { default as duration } from 'dayjs/plugin/duration'
import { default as relativeTime } from 'dayjs/plugin/relativeTime'
import { default as advancedFormat } from 'dayjs/plugin/advancedFormat'

dayjs.extend(weekOfYear) // Week of year
dayjs.extend(duration) // Duration
dayjs.extend(relativeTime) // TimeAgo
dayjs.extend(advancedFormat) // Week of year with ordinal

export default dayjs

export const uni = (ts: number | string) => (+ts < 10000000000 ? +ts * 1000 : ts)

export const format = (ts: number | string) => dayjs(uni(ts)).format('YYYY-MM-DD HH:mm:ss')

export const timeAgo = (ts: number | string) => dayjs(uni(ts)).fromNow()
