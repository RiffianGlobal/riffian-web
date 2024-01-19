import { default as dayjs } from 'dayjs'
import { default as weekOfYear } from 'dayjs/plugin/weekOfYear'
import { default as duration } from 'dayjs/plugin/duration'
import { default as relativeTime } from 'dayjs/plugin/relativeTime'

dayjs.extend(weekOfYear)
dayjs.extend(duration)
dayjs.extend(relativeTime)

export default dayjs

export const uni = (ts: number | string) => (+ts < 10000000000 ? +ts * 1000 : ts)

export const format = (ts: number | string) => dayjs(uni(ts)).format('YYYY-MM-DD HH:mm:ss')

export const timeAgo = (ts: number | string) => dayjs(uni(ts)).fromNow()
