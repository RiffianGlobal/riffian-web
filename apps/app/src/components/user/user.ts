import {
  TailwindElement,
  customElement,
  html,
  property,
  state,
  when,
  until
} from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { user } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/dialog/prompt'
import '~/components/rewards/claim'
import { formatUnits } from 'ethers'
import { readTwitter } from '~/components/top/action'
import { Tweet, tweetStore } from '~/components/top/tweet'

const defErr = () => ({ tx: '' })
@customElement('user-detail')
export class TrackDetail extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  bindTweets: any = new StateController(this, tweetStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) address = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: Promise<any> | undefined
  @state() retreatDisabled = true
  @state() socialName = ''
  @state() socialURI = ''
  @state() socialID = ''
  @state() socialVerified = false
  @state() user: any = {}
  @state() voteList: any = []
  @state() pending = false
  @state() prompt = false
  @state() dialog = false
  @state() promptMessage: string = ''
  @state() err = defErr()

  get disabled() {
    return !bridgeStore.bridge.account
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  get tweets() {
    return tweetStore.tweets
  }

  readFromLocal(key: any) {
    let result: Tweet = { key: '', author_name: '', author_url: '', html: '' }
    this.tweets.some((tweet: any) => {
      if (tweet.key == key) {
        result = tweet
      }
    })
    return result
  }

  async readFromTwitter() {
    if (this.user && this.user.socials) {
      let uri = this.user.socials[0][2]
      let tweet: Tweet = this.readFromLocal(uri)
      if (!tweet.key || tweet.key.length == 0) {
        tweet = await readTwitter(uri)
        tweet['key'] = uri
        this.tweets.unshift(tweet)
        tweetStore.save()
      }
      this.socialName = tweet.author_name
      this.socialURI = tweet.author_url
      this.socialID = tweet.author_url.substring(tweet.author_url.lastIndexOf('/') + 1, tweet.author_url.length - 1)
      this.socialVerified = tweet.html.includes(this.user.address)
      this.socialVerified = true
    } else {
      this.socialName = 'Unknown'
      this.socialURI = ''
      this.socialID = 'NotBind'
      this.socialVerified = false
    }
  }

  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))
  init = async () => {
    this.pending = true
    try {
      let result = await user(this.address)
      this.user = result.user
      console.log('user->' + this.user)
      this.readFromTwitter()
    } catch (e: any) {
      this.promptMessage = e
      this.prompt = true
      return
    } finally {
      this.pending = false
    }
  }

  close = () => {
    this.dialog = false
    this.init()
  }

  render() {
    return html`<div>
        ${when(
          this.pending && !this.user,
          () =>
            html`<div name="Loading" class="doc-intro">
              <div class="flex flex-col gap-8 m-8">
                <loading-skeleton num="3"></loading-skeleton>
              </div>
            </div>`
        )}
        ${when(
          this.user,
          () => html`
            <div slot="center" class="grid mx-4 mt-4 grid-cols-6 gap-4 place-items-center">
              <div class="flex grow pb-4 col-span-1">
                <div>
                  <ui-address .address="${this.user.address}" short avatar></ui-address>
                  <div>
                    <div class="text-sm font-light text-blue-300">
                      ${when(
                        this.socialVerified,
                        () => html`<span><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`
                      )}${this.socialName}
                    </div>
                    <div class="text-sm font-light text-blue-300">
                      <a href="${this.socialURI}" target="_blank">@${this.socialID}</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="">
                <div class="text-sm text-gray-500 align-center">Holding</div>
                <div class="text-4xl align-center">${this.user.holding}</div>
              </div>
              <div class="">
                <div class="text-sm text-gray-500 align-center">Reward Claimed</div>
                <div class="text-4xl align-center">${this.user.rewardClaimed}</div>
              </div>
            </div>
          `
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}