import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
import { subjectInfo } from './action'
import { formatUnits } from 'ethers'
import { throttle } from '@riffian-web/ethers/src/utils'
import { tweetStore, genTweetURI, type Social } from '~/store/tweet'
import { myVotes } from '~/components/top/action'
import emitter from '@lit-web3/base/emitter'
// Components
import '~/components/top/dialog'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'

import style from './detail.css?inline'

const defErr = () => ({ tx: '' })

@customElement('track-detail')
export class TrackDetail extends ThemeElement(style) {
  bindWallet: any = new StateController(this, walletStore)
  bindTweets: any = new StateController(this, tweetStore)

  @property({ type: Boolean }) weekly = false
  @property({ type: String }) trackAddress = ''

  // @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: bigint | undefined
  // @state() retreatDisabled = true
  @state() social: Social | undefined
  @state() subject: any = null
  @state() voteList: any = []
  @state() pending = false
  @state() prompt = false
  @state() dialog = false
  @state() promptMessage: string = ''
  @state() err = defErr()
  @state() actionType = ''
  @state() inited = false

  get disabled() {
    return !walletStore.account
  }

  get voteEnable() {
    return this.inited && !this.disabled
  }
  get retreatEnable() {
    if (!this.myVotes) return false
    return this.inited && +formatUnits(this.myVotes, 0) > 0
  }
  get creatorAddr() {
    return this.subject?.creator?.address
  }
  get empty() {
    return this.inited && !this.subject
  }
  get loading() {
    return !this.inited && this.pending
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  readFromTwitter = async () => {
    const { creator } = this.subject ?? {}
    if (!creator) return
    const { address, socials = [] } = creator
    const { uri } = socials[0] ?? {}
    this.social = await tweetStore.fromUri(uri, address)
  }

  getPrice = async () => {
    try {
      // this.votes = albumData(this.trackAddress).then((result) => result[4])
      this.myVotes = await myVotes(this.trackAddress)
      // this.price = votePrice(this.trackAddress).then((price) => formatUnits(price))
    } catch (err: any) {
      this.updateErr({ tx: err.message || err.code })
    }
  }
  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))
  fetch = async () => {
    this.pending = true
    try {
      this.getPrice()
      const { subject } = await subjectInfo(this.trackAddress)
      this.subject = subject
      this.emit('change', subject)
      this.readFromTwitter()
    } catch (e: any) {
      this.promptMessage = e
      this.prompt = true
    } finally {
      this.inited = true
      this.pending = false
    }
  }

  close = () => {
    this.dialog = false
  }

  setAction = (action: string) => (this.actionType = action)

  popAction = (action: string = 'vote') => {
    if ((action == this.actionType && this.dialog) || !this[`${action}Enable`]) return
    this.setAction(action)
    this.dialog = true
  }

  share = async (e: CustomEvent, item: any) => {
    e.stopPropagation()
    const { id = '', name = '' } = item
    let [title, url] = ['', '']
    if (id) url = `(https://app.riffian.global/${'track/' + id})`
    const target = await genTweetURI(`Stay tuned with me. I\'m at Riffian.global! #riffian @RiffianClub ${name}${url}`)
    window.open(target, '_blank')
  }

  listener = throttle(this.fetch)
  connectedCallback() {
    super.connectedCallback()
    this.fetch()
    emitter.on('block-world', this.listener)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('block-world', this.listener)
  }

  render() {
    // Loading
    if (this.loading)
      return html`<div name="Loading" class="doc-intro">
        <div class="flex flex-col gap-8 m-8">
          <loading-skeleton num="3"></loading-skeleton>
        </div>
      </div>`
    // Empty
    return html`
      <!-- Track Detail -->
      <div class="grid lg_grid-cols-13 gap-6 lg_gap-8">
        ${when(
          this.empty,
          () =>
            html`<p class="mx-4 h-full">No data found.</p>
              <p></p>`,
          () =>
            html`<!-- meta info -->
              <div class="lg_col-span-6 flex gap-4 md_gap-8">
                <!-- Cover -->
                <div class="relative w-28 h-28 md_w-44 md_h-44 rounded-xl bg-white/10">
                  <img-loader src=${this.subject.image} class="w-28 h-28 md_w-44 md_h-44 rounded-xl"></img-loader>
                  ${when(
                    this.subject.uri,
                    () => html`
                      <div class="flex justify-center items-center absolute left-0 top-0 right-0 bottom-0">
                        <ui-button icon lg href=${this.subject.uri}
                          ><i
                            class="mdi mdi-play-circle text-[rgba(255,255,255,.4)] hover_text-white text-5xl lg_text-6xl drop-shadow-2xl transition-all"
                          ></i
                        ></ui-button>
                      </div>
                    `
                  )}
                </div>
                <!-- Details -->
                <div class="flex flex-col h-full justify-between md_gap-4">
                  <div>
                    <div class="text-lg md_text-xl md_mb-2.5">${this.subject.name ?? '-'}</div>
                    <!-- Author DOID -->
                    <div class="text-sm md_text-base min-h-6 leading-6">
                      <ui-address .address=${this.creatorAddr} short doid avatar></ui-address>
                    </div>
                    <!-- Author social name -->
                    <div class="text-sm md_text-base md_min-h-6 md_leading-6">
                      ${when(
                        this.social,
                        () => html`
                          ${this.social?.name}<a
                            class="text-xs leading-none text-blue-300/60"
                            href="${this.social?.url}"
                            target="_blank"
                            >@${this.social?.id}</a
                          >
                        `,
                        () => html`-`
                      )}
                    </div>
                  </div>
                  <div class="flex gap-2.5 md_gap-4 items-center mt-2">
                    ${when(
                      this.voteEnable,
                      () => html`
                        <ui-button
                          class="w-16 md_w-24"
                          ?disabled="${this.dialog || !this.voteEnable}"
                          @click=${() => this.popAction('vote')}
                          >Vote</ui-button
                        >
                      `
                    )}
                    ${when(
                      this.retreatEnable,
                      () =>
                        html`<ui-button
                          class="w-16 md_w-24"
                          ?disabled="${this.dialog || !this.retreatEnable}"
                          @click=${() => this.popAction('retreat')}
                          >Retreat</ui-button
                        >`
                    )}
                    ${when(
                      this.dialog,
                      () =>
                        html`<vote-album-dialog
                          action=${this.actionType}
                          album=${this.subject.id}
                          url=${this.subject.image}
                          name=${this.subject.name}
                          votes=${this.subject.supply}
                          author=${this.creatorAddr}
                          @close=${this.close}
                          @change=${this.fetch}
                        ></vote-album-dialog>`
                    )}

                    <ui-button
                      icon
                      class="!lg_w-10 !lg_h-10 outlined !border-white !rounded-md"
                      @click=${(e: CustomEvent) => this.share(e, this.subject)}
                      ><slot name="icon"
                        ><i class="mdi mdi-share-variant-outline cursor-pointer text-2xl text-white"></i></slot
                    ></ui-button>
                  </div>
                </div>
              </div>
              <!-- statistic -->
              <div
                class="lg_col-start-7 lg_col-span-8 grid grid-cols-8 lg_gap-4 divide-x divide-white/20 md_divide-x-0 place-items-center items-center shrink grow-0"
              >
                <div
                  class="lg_col-start-1 col-span-2 flex flex-col justify-center items-center w-full lg_h-4/5 lg_bg-white/5 lg_rounded-xl lg_gap-1.5"
                >
                  <div class="text-xs md_text-base text-gray-500 align-center">Voters</div>
                  <div class="text-xl lg_text-4xl font-light align-center lining-nums">${this.subject.fansNumber}</div>
                </div>
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full lg_h-4/5 lg_bg-white/5 lg_rounded-xl lg_gap-1.5"
                >
                  <div class="text-xs md_text-base text-gray-500 align-center">Tickets</div>
                  <div class="text-xl lg_text-4xl font-light align-center lining-nums">${this.subject.supply}</div>
                </div>
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full lg_h-4/5 lg_bg-white/5 lg_rounded-xl lg_gap-1.5"
                >
                  <div class="text-xs md_text-base text-gray-500 align-center">Volume</div>
                  <div class="text-xl lg_text-4xl font-light align-center lining-nums">
                    ${formatUnits(this.subject.totalVoteValue)}
                  </div>
                </div>
                <!--  -->
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full lg_h-4/5 lg_bg-white/5 lg_rounded-xl lg_gap-1.5"
                >
                  <div class="text-xs md_text-base text-gray-500 align-center">Price</div>
                  <div class="text-xl lg_text-4xl font-light align-center lining-nums">
                    ${(+this.subject.supply + 1) / 10}
                  </div>
                </div>
              </div>`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}
    `
  }
}
