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
import emitter from '@lit-web3/base/emitter'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { vote, albumData, votePrice, votePriceWithFee, myVotes, retreatPrice, retreat, getSocials } from './action'
import { formatUnits } from 'ethers'
import { tweetStore, type Social } from '~/store/tweet'

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
  @property({ type: String }) action = ''
  @property({ type: String }) album = ''
  @property({ type: String }) url = ''
  @property({ type: String }) name = ''
  @property({ type: String }) author = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: any = 0
  @state() price: Promise<any> | undefined
  @state() retreatPrice: any = 0
  @state() retreatDisabled = true
  @state() social: Social | undefined
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
    this.social = await tweetStore.fromAddress(this.author)
  }

  async getPrice() {
    try {
      this.votes = albumData(this.album).then((result) => result[4])
      this.myVotes = await myVotes(this.album).then((votes) => {
        if (votes > 0) this.retreatDisabled = false
        return votes
      })
      this.price = votePrice(this.album).then((price) => formatUnits(price))
      this.retreatPrice = await retreatPrice(this.album).then((price) => formatUnits(price))
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
      this.emitChange()
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) {
        this.updateErr({ tx: msg })
        return this.close()
      }
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
      await this.emitChange()
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) {
        this.updateErr({ tx: msg })
        return this.close()
      }
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
  emitChange = () => {
    this.emit('change')
    emitter.emit('manual-change')
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
                  this.social?.verified,
                  () => html`<span><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`
                )}${this.social?.name}
              </div>
              ${when(
                this.social?.id,
                () => html`
                  <a class="text-sm text-blue-300" href="${this.social?.url}" target="_blank">@${this.social?.id}</a>
                `,
                () => html`-`
              )}

              <div class="text-neutral-400">
                You own
                ${when(
                  this.ts,
                  () => html`${formatUnits(this.myVotes, 0)}`,
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
        <div class="mt-8">
          ${when(
            !this.pending,
            () => html`
              ${when(
                this.ts && this.action === 'vote',
                () => html`
                  <div class="flex flex-col justify-center items-center px-4">
                    <div>
                      <span class="text-2xl">${until(this.price, html`<i class="text-sm mdi mdi-loading"></i>`)}</span>
                    </div>
                    <ui-button
                      class="mt-3 w-full"
                      ?disabled=${this.pending}
                      ?pending=${this.pending}
                      @click=${this.vote}
                      >Vote</ui-button
                    >
                  </div>
                `
              )}
              ${when(
                this.ts && this.hasVoted && this.action === 'retreat',
                () => html`
                  <div class="flex flex-col justify-center items-center px-4 border-white/12">
                    <div class="text-2xl">
                      ${until(this.retreatPrice, html`<i class="text-sm mdi mdi-loading"></i>`)}
                    </div>

                    <ui-button
                      class="mt-3 w-full"
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
              </div> -->
            `,
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
