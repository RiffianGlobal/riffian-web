import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'
import { emitter } from '@lit-web3/base/emitter'
import { weeklyStore } from './weekly'
import { chartsReq } from '~/query'
import { throttle } from '@riffian-web/ethers/src/utils'

// !This store only cache first page data of subjects
class ChartsStore extends State {
  @property({ value: [] }) weeklySubjects!: []
  @property({ value: [] }) subjects!: []
  @property({ value: [] }) votes!: []
  @property({ value: true }) pending!: boolean
  @property({ value: false }) inited!: boolean

  constructor() {
    super()
    this.init()
  }

  fetch = async () => {
    try {
      const week = await weeklyStore.getLatest()
      const { weeklySubjects, subjects, votes } = await chartsReq({ week })
      this.weeklySubjects = weeklySubjects
      this.subjects = subjects
      this.votes = votes
    } catch (err) {
      console.error(err)
    }
    this.pending = false
    this.inited = true
  }

  init = async () => {
    this.fetch()
    emitter.on('block-world', this.listener)
  }
  listener = throttle(this.fetch)
}
export const chartsStore = new ChartsStore()
