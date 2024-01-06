import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { user } from './action'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import '~/components/rewards/claim'
import { readTwitter } from '~/components/top/action'
import { Tweet, tweetStore } from '~/components/top/tweet'
import style from './user.css?inline'

const defErr = () => ({ loading: '', tx: '' })

@customElement('user-detail')
export class TrackDetail extends ThemeElement(style) {
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
  @state() user: any
  @state() voteList: any = []
  @state() pending = false
  @state() prompt = false
  @state() dialog = false
  @state() promptMessage: string = ''
  @state() err = defErr()
  @state() ts = 0

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
      // console.info(this.user.socials)
      let uri = this.user.socials[0]?.uri
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
      this.readFromTwitter()
    } catch (e: any) {
      this.updateErr({ load: e.message || e })
      this.promptMessage = e
      this.prompt = true
      return
    } finally {
      this.ts++
      this.pending = false
    }
  }

  close = () => {
    this.dialog = false
    this.init()
  }

  render() {
    return html`<div class="m-4 text-center">
      ${when(
        !this.ts && !this.err.load,
        () =>
          html`<div name="Loading" class="doc-intro">
            <div class="flex flex-col gap-8 m-8">
              <loading-skeleton num="3"></loading-skeleton>
            </div>
          </div>`,
        () =>
          html`${when(
            this.prompt,
            () => html`<p class="text-center text-orange-600">${this.promptMessage}</p>`,
            () =>
              html`<div class="py-4">
                <ui-address class="text-lg" .address="${this.user.address}" short avatar></ui-address>
                <div class="mt-4">
                  <span class="text-base font-light middle-dot-divider">
                    ${when(
                      this.socialVerified,
                      () =>
                        html`${this.socialName}<span class="ml-0.5"
                            ><i class="text-green-600 text-sm mdi mdi-check-decagram"></i
                          ></span>`
                    )}
                  </span>
                  <span class="text-base font-light">
                    <a href="${this.socialURI}" class="text-blue-300" target="_blank">@${this.socialID}</a>
                  </span>
                </div>
                <div class="mt-0.5">
                  <span class="text-base text-white/70 middle-dot-divider"
                    >Holding <span class="ml-1 text-blue-300">${this.user.holding ?? '-'}</span></span
                  >
                  <span class="text-base text-white/70"
                    >Reward Claimed <span class="ml-1 text-blue-300">${this.user.rewardClaimed ?? '-'}</span></span
                  >
                </div>
              </div>`
          )}`
      )}
    </div>`
  }
}
