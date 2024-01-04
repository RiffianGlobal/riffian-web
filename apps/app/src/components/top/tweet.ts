import { State, property } from '@lit-web3/base/state'

class Tweets extends State {
  key = ''
  constructor() {
    super()
    this.key = 'tweets'
    this.sync()
  }
  @property({ value: [] }) tweets!: Tweet[]
  sync() {
    this.tweets = JSON.parse(localStorage.getItem(this.key) || '[]')
  }
  save() {
    this.tweets = [...this.tweets]
    localStorage.setItem(this.key, JSON.stringify(this.tweets))
  }
}
export const tweetStore = new Tweets()

export type Tweet = {
  key: any
  author_name: string
  author_url: string
  html: string
}
