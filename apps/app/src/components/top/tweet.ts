import { State, property } from '@lit-web3/base/state'
import fetchJsonP from 'fetch-jsonp'
import { ttlStorage } from '@riffian-web/ethers/src/utils'
import { weekSeconds } from '~/constants'

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

export type TweetCache = {
  [uri: string]: Social
}

// TODO: merge to ttlStore
class Tweets extends State {
  @property({ value: {} }) tweets!: TweetCache

  constructor() {
    super()
    // TODO: remove this after mainnet launched
    ttlStorage.removeItem('tweets')
  }

  key = (uri: string) => `tweet.${uri}`

  set = (uri: string, twitter: Social, save = false) => {
    this.tweets = { ...this.tweets, [uri]: twitter }
    if (save) ttlStorage.setItem(this.key(uri), JSON.stringify(twitter), weekSeconds * 1000)
    return twitter
  }

  promises: any = {} // debounce promise
  get = async (uri: string) => {
    // 1. from state
    let twitter: Social | null | undefined = this.tweets[uri]
    if (twitter) return twitter
    // 2. from ttlStorage
    const storaged: string | null = ttlStorage.getItem(this.key(uri))
    if (storaged) return this.set(uri, (twitter = JSON.parse(storaged)))
    // 3. from api
    const promise = this.promises[uri]
    if (promise) return promise
    return (this.promises[uri] = new Promise(async (resolve) => {
      twitter = await getTwitter(uri)
      if (twitter) {
        this.set(uri, twitter, true)
        resolve(twitter)
      } else resolve(undefined)
    }).finally(() => delete this.promises[uri]))
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
