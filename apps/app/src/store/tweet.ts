// TODO: support more sns
import { State, property } from '@lit-web3/base/state'
export { StateController } from '@lit-web3/base/state'
import fetchJsonP from 'fetch-jsonp'
import { ttlStorage } from '@riffian-web/ethers/src/utils'
import { toGid } from '@riffian-web/ethers/src/uuid'
import { getAlbumContract } from '~/lib/riffutils'
import { walletStore } from '@riffian-web/ethers/src/wallet'
import { weekSeconds, Official, Domain } from '~/constants'

export const readTweet = async (uri: string): Promise<Tweet | undefined> => {
  let res
  if (uri)
    try {
      res = await (await fetchJsonP('https://publish.twitter.com/oembed?url=' + encodeURIComponent(uri))).json()
    } catch {}
  return res
}

export const genGid = (address: string) => toGid(address, Domain)

export const tweetRegExp = new RegExp(`(${Official}).*?Gid: (\\w+)?`)

export const getTwitter = async (uri: string, verifyAddress?: string) => {
  const { author_name: name = '', author_url: url = '', html = '' } = (await readTweet(uri)) ?? {}
  if (!name) return
  const [, official, gid = ''] = html.match(tweetRegExp) ?? []
  // Official account invalid
  // if (official !== Official) return
  const res: Social = {
    name,
    url,
    gid,
    id: (url.match(/([^/]+?)$/) ?? [])[1] ?? ''
  }
  const verified = verifyAddress && gid ? gid === genGid(verifyAddress) : false
  if (verified) res.address = verifyAddress
  return res
}

export type TweetMemCache = {
  [uri: string]: Social
}

// TODO: merge to ttlStore
class Tweets extends State {
  @property({ value: {} }) tweets!: TweetMemCache
  @property({ value: '' }) selfTweetURI!: string

  constructor() {
    super()
    this.init()
  }

  key = (uri: string) => `tweet.${uri}`

  set = (uri: string, twitter: Social, save = false) => {
    this.tweets = { ...this.tweets, [uri]: twitter }
    if (save) {
      ttlStorage.setItem(this.key(uri), JSON.stringify(twitter), weekSeconds * 1000)
    }
    return twitter
  }

  promises: any = {} // debounce promise
  fromUri = async (uri: string, verifyAddress?: string) => {
    // 1. from state
    let twitter: Social | null | undefined = this.tweets[uri]
    if (twitter) return twitter
    // 2. from ttlStorage
    const stored: string | null = ttlStorage.getItem(this.key(uri))
    if (stored) return this.set(uri, (twitter = JSON.parse(stored)))
    // 3. from api
    const promise = this.promises[uri]
    if (promise) return promise
    return (this.promises[uri] = new Promise(async (resolve) => {
      twitter = await getTwitter(uri, verifyAddress)
      if (twitter) {
        this.set(uri, twitter, true)
        resolve(twitter)
      } else resolve(undefined)
    }).finally(() => delete this.promises[uri]))
  }

  fetchSelf = async () => {
    const { account } = walletStore
    if (!account) return
    this.selfTweetURI = await this.addressToUri(account)
    if (this.selfTweetURI) await this.fromUri(this.selfTweetURI, account)
    return this.selfTweetURI
  }
  get selfTwitter() {
    return this.tweets[this.selfTweetURI]
  }
  get selfValid() {
    return this.selfTwitter?.address == walletStore.account
  }

  addressToUri = async (address: string) => {
    let uri = ''
    try {
      const contract = await getAlbumContract(true)
      const [[platform, , _uri]] = (await contract.getSocials(address)) ?? []
      if (platform === 'twitter') uri = _uri
    } catch {}
    return uri
  }
  fromAddress = async (address: string) => {
    const uri = (await this.addressToUri(address)) ?? ''
    return await this.fromUri(uri, address)
  }

  init = async () => {
    this.fetchSelf()
    const contract = await getAlbumContract()
    contract.on('EventBind', this.listener)
  }
  listener = async (acc: string) => {
    if (acc !== walletStore.account) this.fetchSelf()
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
  gid: string
  address?: string
}

export const genTweetURI = async (txt: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}`
