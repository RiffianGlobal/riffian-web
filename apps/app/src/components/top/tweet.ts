import { State, property } from '@lit-web3/base/state'
import fetchJsonP from 'fetch-jsonp'
import { ttlStorage } from '@riffian-web/ethers/src/utils'

export const readTweet = async (uri: string): Promise<Tweet | undefined> => {
  let res
  if (uri)
    try {
      res = await (await fetchJsonP('https://publish.twitter.com/oembed?url=' + encodeURIComponent(uri))).json()
    } catch {}
  return res
}

export const getTwitter = async (uri: string) => {
  const { author_name: name = '', author_url: url = '', html = '' } = (await readTweet(uri)) ?? {}
  if (!name) return
  return {
    name,
    url,
    id: (url.match(/([^/]+?)$/) ?? [])[1] ?? '',
    address: (html.match(/(0x([a-zA-Z0-9]+)?)/) ?? [])[1] ?? ''
  }
}

class Tweets extends State {
  key = ''
  constructor() {
    super()
    this.key = 'tweets'
    this.sync()
  }
  @property({ value: {} }) tweets!: Record<string, Social>
  sync = () => {
    let cached = JSON.parse(ttlStorage.getItem(this.key) || '{}')
    // TODO: remove this after mainnet launched
    if (new Date().getTime() < 1704798753768) {
      ttlStorage.removeItem(this.key)
      cached = {}
    }
    this.tweets = cached
  }
  save = () => {
    this.tweets = { ...this.tweets }
    ttlStorage.setItem(this.key, JSON.stringify(this.tweets), 86400 * 7 * 1000)
  }
  set = (uri: string, twitter: Social) => {
    this.tweets[uri] = twitter
    this.save()
  }
  async get(uri: string) {
    let res: Social | undefined = this.tweets[uri]
    if (!res) {
      res = await getTwitter(uri)
      if (res) this.set(uri, res)
    }
    return res
  }
}
export const tweetStore = new Tweets()

export type Tweet = {
  author_name: string
  author_url: string
  html: string
}
export type Social = {
  name: string
  url: string
  id: string
  address: string
  verified?: boolean
}
