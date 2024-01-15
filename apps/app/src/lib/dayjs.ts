import { default as dayjs } from 'dayjs'
import { default as weekOfYear } from 'dayjs/plugin/weekOfYear'
import { default as duration } from 'dayjs/plugin/duration'

dayjs.extend(weekOfYear)
dayjs.extend(duration)

export default dayjs
