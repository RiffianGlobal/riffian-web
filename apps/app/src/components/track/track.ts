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
import { subjectInfo } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/dialog/prompt'
import '~/components/rewards/claim'
import emitter from '@riffian-web/core/src/emitter'
import style from './list.css?inline'
import { formatUnits } from 'ethers'
import { albumData, myVotes, readTwitter } from '~/components/top/action'
import { Tweet, tweetStore } from '~/components/top/tweet'

const defErr = () => ({ tx: '' })
@customElement('track-detail')
export class TrackDetail extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindTweets: any = new StateController(this, tweetStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) trackAddress = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: Promise<any> | undefined
  @state() retreatDisabled = true
  @state() socialName = ''
  @state() socialURI = ''
  @state() socialID = ''
  @state() socialVerified = false
  @state() subject: any = {}
  @state() voteList: any = []
  @state() pending = false
  @state() prompt = false
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
    let uri = this.subject.creator.socials[0][2]
    let tweet: Tweet = this.readFromLocal(uri)
    console.log('Read tweet from localStorage')
    if (!tweet.key || tweet.key.length == 0) {
      tweet = await readTwitter(uri)
      tweet['key'] = uri
      this.tweets.unshift(tweet)
      tweetStore.save()
    }
    this.socialName = tweet.author_name
    this.socialURI = tweet.author_url
    this.socialID = tweet.author_url.substring(tweet.author_url.lastIndexOf('/') + 1, tweet.author_url.length - 1)
    console.log(this.socialID)
    this.socialVerified = tweet.html.includes(this.subject.creator.address)
    this.socialVerified = true
  }

  async getPrice() {
    try {
      this.votes = albumData(this.trackAddress).then((result) => result[4])
      this.myVotes = myVotes(this.trackAddress).then((votes) => {
        if (votes > 0) this.retreatDisabled = false
        return votes
      })
      // this.price = votePrice(this.trackAddress).then((price) => formatUnits(price, 18))
      // this.retreatPrice = retreatPrice(this.trackAddress).then((price) => formatUnits(price, 18))
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ tx: msg })
    }
  }
  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))
  init = async () => {
    this.pending = true
    try {
      let result = await subjectInfo(this.trackAddress)
      this.subject = result.subject
      console.log(this.subject)
      this.getPrice()
      this.readFromTwitter()
    } catch (e: any) {
      console.error(e)
      this.promptMessage = e
      this.prompt = true
      return
    } finally {
      this.pending = false
    }
  }

  close = () => {
    this.init()
  }

  render() {
    return html`<div>
        ${when(
          this.pending && !this.subject,
          () =>
            html`<div name="Loading" class="doc-intro">
              <div class="flex flex-col gap-8 m-8">
                <loading-skeleton num="3"></loading-skeleton>
              </div>
            </div>`
        )}
        ${when(
          this.subject,
          () => html`
            <div slot="center" class="flex mx-4 mt-4">
              <div class="flex grow pb-4">
                <div class="w-24 mr-4"><img-loader src=${this.subject.url}></img-loader></div>
                <div>
                  <div class="text-lg font-bold">${this.subject.name}</div>
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
                  <div class="text-gray-500">
                    You own ${until(this.myVotes, html`<i class="text-sm mdi mdi-loading"></i>`)} tickets
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-lg text-sky-500"
                  >${until(this.votes, html`<i class="text-sm mdi mdi-loading"></i>`)}</span
                >
                <div class="text-sm text-gray-500">Tickets</div>
                <div class="text-sm text-gray-500">Vote price <i class="text-sm mdi mdi-help-circle-outline"></i></div>
              </div>
            </div>
          `
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
