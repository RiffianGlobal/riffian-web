import {
  ThemeElement,
  customElement,
  html,
  property,
  state,
  until,
  when,
  classMap
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { vote, albumData, votePrice, votePriceWithFee, myVotes, retreatPrice, retreat, getSocials } from './action'
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
  @state() myVotes: any = 0
  @state() price: Promise<any> | undefined
  @state() retreatPrice: any = 0
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
  @state() ts = 0

  async connectedCallback() {
    super.connectedCallback()
    await this.getPrice()
    await this.readFromTwitter()
    this.ts++
  }

  get hasVoted() {
    return this.ts && +formatUnits(this.myVotes, 1) > 0
  }

  async readFromTwitter() {
    const uri = await getSocials(this.author)
    const tweet = await tweetStore.get(uri)
    this.socialName = tweet.author_name
    this.socialURI = tweet.author_url
    this.socialID = tweet.author_url.substring(tweet.author_url.lastIndexOf('/') + 1, tweet.author_url.length - 1)
    this.socialVerified = tweet.html.includes(this.author)
    this.socialVerified = true
  }

  async getPrice() {
    try {
      this.votes = albumData(this.album).then((result) => result[4])
      this.myVotes = await myVotes(this.album).then((votes) => {
        if (votes > 0) this.retreatDisabled = false
        return votes
      })
      this.price = votePrice(this.album).then((price) => formatUnits(price, 18))
      this.retreatPrice = await retreatPrice(this.album).then((price) => formatUnits(price, 18))
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
      <p slot="header" class="w-full text-base mr-2">Vote Track</p>
      <div slot="center" class="flex mx-4 my-6">
        <div class="flex grow justify-between p-4 bg-black/20">
          <!-- meta info -->
          <div class="flex gap-6">
            <div class="w-24 h-24 rounded-lg bg-white/10">
              <img-loader class="w-24 h-24 rounded-lg" src=${this.url}></img-loader>
            </div>
            <div>
              <div class="text-lg mb-1.5">${this.name}</div>
              <div class="text-sm">
                ${when(
                  this.socialVerified,
                  () => html`<span><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`
                )}${this.socialName}
              </div>

              <a class="text-sm text-blue-300" href="${this.socialURI}" target="_blank">@${this.socialID}</a>

              <div class="text-neutral-400">
                You own
                ${when(
                  this.ts,
                  () => html`${this.myVotes.length}`,
                  () => html`<i class="text-sm mdi mdi-loading"></i>`
                )}
                tickets
              </div>
            </div>
          </div>
          <!-- Tickets -->
          <div class="text-right">
            <span class="text-lg text-sky-500"
              >${until(this.votes, html`<i class="text-sm mdi mdi-loading"></i>`)}</span
            >
            <div class="text-sm text-gray-500">Tickets</div>
          </div>
        </div>
        <!-- tip -->
      </div>
      <div slot="bottom" class="mx-4 pb-8">
        <p class="w-full flex justify-between items-center">
          It will cost
          <span class="text-right"
            ><span class="text-sm text-gray-500">Vote price <i class="text-sm mdi mdi-help-circle-outline"></i></span
          ></span>
        </p>
        <div
          class="mt-8 grid divide-x divide-blue-400/20 ${classMap(
            this.$c([this.hasVoted && !this.pending ? 'grid-cols-2' : 'grid-cols-1'])
          )}"
        >
          ${when(
            !this.pending,
            () =>
              html`<div class="flex flex-col justify-center items-center px-4">
                  <div>
                    <span class="text-2xl text-"
                      >${until(this.price, html`<i class="text-sm mdi mdi-loading"></i>`)}
                      <span class="text-sm ml-0.5 opacity-70">ST</span></span
                    >
                  </div>
                  <ui-button class="mt-3 w-full" ?disabled=${this.pending} ?pending=${this.pending} @click=${this.vote}
                    >Vote</ui-button
                  >
                </div>
                ${when(
                  this.ts && this.hasVoted,
                  () => html`
                    <div class="flex flex-col justify-center items-center px-4 border-white/12">
                      <div class="text-2xl">
                        ${until(this.retreatPrice, html`<i class="text-sm mdi mdi-loading"></i>`)}
                        <span class="text-sm ml-0.5 opacity-70">ST</span>
                      </div>

                      <ui-button
                        class="mt-3 w-full outlined"
                        ?disabled=${this.retreatDisabled}
                        ?pending=${this.retreatDisabled}
                        @click=${this.retreat}
                        >Retreat</ui-button
                      >
                    </div>
                  `
                )}
                <!-- <div class="text-sm text-gray-500">
                Retreat price: ${until(this.retreatPrice, html`<i class="text-sm mdi mdi-loading"></i>`)} FTM
              </div> --> `,
            () =>
              html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your vote has been submitted.' } }}
                ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
              >`
          )}
        </div>
      </div>
    </ui-dialog>`
  }
}
