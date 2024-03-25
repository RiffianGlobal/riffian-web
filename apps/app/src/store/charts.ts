import { State, property, storage } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'
import { emitter } from '@lit-web3/base/emitter'
import { weeklyStore } from './weekly'
import { chartsReq, subjectsReq } from '~/query'
import { throttle } from '@riffian-web/ethers/src/utils'

export const Charts = [
  { key: 'top', title: `Top` },
  { key: 'new', title: `New` },
  { key: 'trending', title: `Trending` }
]
export const topCharts = Object.values(Charts).map((r) => r.key)

// !This store only cache first page data of subjects
class ChartsStore extends State {
  @property({ value: [] }) weeklySubjects!: []
  @property({ value: [] }) subjects!: []
  @property({ value: [] }) votes!: []
  @property({ value: true }) pending!: boolean
  @property({ value: false }) inited!: boolean
  @property({ value: true }) chartPending!: boolean
  @storage({ key: 'app.chart' })
  @property({ value: 'top' })
  cate!: string

  private cachedSubjects: Record<string, []> = {}

  constructor() {
    super()
    this.fetch()
    emitter.on('block-world', this.listener)

    this.subscribe(async (_, cate) => {
      this.fetchSubjects(cate)
    }, 'cate')
  }

  #updateSubjects = (cate: string, subjects: []) => {
    this.cachedSubjects[cate] = subjects
    if (cate === this.cate) this.subjects = this.cachedSubjects[cate]
  }

  fetch = async () => {
    try {
      const week = await weeklyStore.getLatest()
      const cate = this.cate
      const { weeklySubjects, subjects, votes } = await chartsReq({ week, cate })
      this.weeklySubjects = weeklySubjects
      this.#updateSubjects(cate, subjects)
      this.votes = votes
    } catch (err) {
      console.error(err)
    }
    this.pending = this.chartPending = false
    this.inited = true
  }

  fetchSubjects = async (cate: string, useCache = true, filters = {}) => {
    this.chartPending = true
    let res = []
    this.subjects = useCache ? this.cachedSubjects[cate] ?? [] : []
    try {
      const { subjects } = await subjectsReq({ cate, ...filters })
      res = subjects
    } catch {}
    this.chartPending = false
    if (useCache) this.#updateSubjects(cate, res)
    return res
  }

  listener = throttle(this.fetch)

  private cachedSearchRes: Record<string, []> = {}
  search = async (keyword = '', first: number = 6, skip: number = 0) => {
    const cacheKey = `${keyword}.${first}.${skip}`
    let cached = this.cachedSearchRes[cacheKey]
    if (!skip && cached) return cached.length > first ? cached.slice(0, first) : cached
    const { subjects } = await subjectsReq({ cate: 'top', first, skip, keyword })
    this.cachedSearchRes[cacheKey] = subjects
    return subjects
  }
}
export const chartsStore = new ChartsStore()
