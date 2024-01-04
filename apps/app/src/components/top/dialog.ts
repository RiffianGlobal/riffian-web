import { ThemeElement, customElement, html, property, state, until, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import {
  vote,
  albumData,
  votePrice,
  votePriceWithFee,
  myVotes,
  retreatPrice,
  retreat,
  readTwitter,
  getSocials
} from './action'
import { formatUnits } from 'ethers'
import { tweetStore, Tweet } from './tweet'

import '@riffian-web/ui/button'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/tx-state'

const defErr = () => ({ tx: '' })
@customElement('vote-album-dialog')
export class VoteAlbumDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  bindTweets: any = new StateController(this, tweetStore)
  @property({ type: String }) album = ''
  @property({ type: String }) url = ''
  @property({ type: String }) name = ''
  @property({ type: String }) author = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: Promise<any> | undefined
  @state() price: Promise<any> | undefined
  @state() retreatPrice: Promise<any> | undefined
  @state() retreatDisabled = true
  @state() socialName = ''
  @state() socialURI = ''
  @state() socialID = ''
  @state() socialVerified = false
  @state() tx: any = null
  @state() success = false
  @state() pending = false
  @state() rewards = false
  @state() err = defErr()

  connectedCallback() {
    super.connectedCallback()
    this.getPrice()
    this.readFromTwitter()
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
    let uri = await getSocials(this.author)
    let tweet: Tweet = this.readFromLocal(uri)
    if (tweet.key.length == 0) {
      tweet = await readTwitter(this.author)
      tweet['key'] = uri
      this.tweets.unshift(tweet)
      tweetStore.save()
    }
    this.socialName = tweet.author_name
    this.socialURI = tweet.author_url
    this.socialID = tweet.author_url.substring(tweet.author_url.lastIndexOf('/') + 1, tweet.author_url.length - 1)
    this.socialVerified = tweet.html.includes(this.author)
    this.socialVerified = true
  }

  async getPrice() {
    try {
      this.votes = albumData(this.album).then((result) => result[4])
      this.myVotes = myVotes(this.album).then((votes) => {
        if (votes > 0) this.retreatDisabled = false
        return votes
      })
      this.price = votePrice(this.album).then((price) => formatUnits(price, 18))
      this.retreatPrice = retreatPrice(this.album).then((price) => formatUnits(price, 18))
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ tx: msg })
    }
  }

  async vote() {
    this.pending = true
    try {
      this.tx = await vote(this.album, 1, { value: (await votePriceWithFee(this.album))[0] })
      this.success = await this.tx.wait()
    } catch (err: any) {
      if (!this.tx) {
        this.tx = {}
        this.tx.status = 0
        this.tx.err = err
      }
    }
  }

  async retreat() {
    this.pending = true
    try {
      this.tx = await retreat(this.album, 1)
      this.success = await this.tx.wait()
    } catch (err: any) {
      if (!this.tx) {
        this.tx = {}
        this.tx.status = 0
        this.tx.err = err
      }
    }
  }

  resetState = () => {
    this.err = defErr()
    this.pending = false
    this.success = false
    this.price = undefined
    this.votes = undefined
  }
  close = async () => {
    this.tx = null
    this.resetState()
    this.emit('close')
  }

  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))

  render() {
    return html`<ui-dialog
      @close=${() => {
        this.close()
      }}
    >
      <p slot="header" class="font-bold">VOTE Track</p>
      <div slot="center" class="flex mx-4 mt-4">
        <div class="flex grow pb-4">
          <div class="w-24 mr-4"><img-loader src=${this.url}></img-loader></div>
          <div>
            <div class="text-lg font-bold">${this.name}</div>
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
          <span class="text-lg text-sky-500">${until(this.votes, html`<i class="text-sm mdi mdi-loading"></i>`)}</span>
          <div class="text-sm text-gray-500">Tickets</div>
          <span class="text-lg text-sky-500"
            >${until(this.price, html`<i class="text-sm mdi mdi-loading"></i>`)} FTM</span
          >
          <div class="text-sm text-gray-500">Vote price <i class="text-sm mdi mdi-help-circle-outline"></i></div>
        </div>
      </div>
      <div slot="bottom" class="mx-4 grid grid-cols-1 text-center">
        ${when(
          !this.pending,
          () =>
            html`<ui-button class="mt-1 w-full" @click=${this.vote}>Vote</ui-button>
              <ui-button class="mt-1 w-full" ?disabled=${this.retreatDisabled} @click=${this.retreat}
                >Retreat</ui-button
              >
              <div class="text-sm text-gray-500">
                Retreat price: ${until(this.retreatPrice, html`<i class="text-sm mdi mdi-loading"></i>`)} FTM
              </div>`,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your vote has been submitted.' } }}
              ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
            >`
        )}
      </div>
    </ui-dialog>`
  }
}
