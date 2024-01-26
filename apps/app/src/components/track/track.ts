import {
  ThemeElement,
  customElement,
  html,
  property,
  state,
  when,
  until,
  keyed
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { subjectInfo } from './action'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import style from './list.css?inline'
import { formatUnits } from 'ethers'
import { albumData, myVotes } from '~/components/top/action'
import { tweetStore, type Social } from '~/store/tweet'

const defErr = () => ({ tx: '' })
@customElement('track-detail')
export class TrackDetail extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
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
  @state() ts = 0

  get disabled() {
    return !bridgeStore.bridge.account
  }

  get voteEnable() {
    return this.ts && !this.disabled
  }
  get retreatEnable() {
    if (!this.myVotes) return false
    return this.ts && +formatUnits(this.myVotes, 0) > 0
  }
  get creatorAddr() {
    return this.subject?.creator?.address
  }

  connectedCallback() {
    super.connectedCallback()
    this.fetch()
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  async readFromTwitter() {
    const { address, socials = [] } = this.subject.creator
    const { uri } = socials[0] ?? {}
    this.social = await tweetStore.fromUri(uri, address)
  }

  async getPrice() {
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
      let result = await Promise.all([subjectInfo(this.trackAddress)])
      this.subject = result[0].subject
      this.getPrice()
      this.readFromTwitter()
    } catch (e: any) {
      this.promptMessage = e
      this.prompt = true
    } finally {
      this.ts++
      this.pending = false
    }
  }

  close = () => {
    this.dialog = false
    this.fetch()
  }

  setAction = (action: string) => (this.actionType = action)

  popAction = (action: string = 'vote') => {
    if ((action == this.actionType && this.dialog) || !this[`${action}Enable`]) return
    this.setAction(action)
    this.dialog = true
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
            </div>`,
          () =>
            html`<div class="grid lg_grid-cols-13 gap-8">
              <!-- meta info -->
              <div class="lg_col-span-6 h-44 flex gap-8">
                <!-- Cover -->
                <div class="relative w-44 h-full rounded-xl bg-white/10">
                  <img-loader src=${this.subject.image} class="w-44 h-full rounded-xl"></img-loader>
                  ${when(
                    this.subject.uri,
                    () => html`
                      <div class="absolute right-1 bottom-1">
                        <ui-button icon lg href=${this.subject.uri}
                          ><i class="mdi mdi-play-circle-outline text-white"></i
                        ></ui-button>
                      </div>
                    `
                  )}
                </div>
                <!-- Details -->
                <div class="flex flex-col h-full justify-between gap-4">
                  <div>
                    <div class="text-xl mb-2.5">${this.subject.name ?? '-'}</div>
                    <!-- Author DOID -->
                    <div class="text-base min-h-6 leading-6">
                      <ui-address .address=${this.creatorAddr} short doid avatar></ui-address>
                    </div>
                    <!-- Author social name -->
                    <div class="text-base min-h-6 leading-6">
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
                  <div class="mt-2 flex gap-4">
                    ${when(
                      this.voteEnable,
                      () => html`
                        <ui-button
                          class="w-24"
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
                          class="w-24"
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
                  </div>
                </div>
              </div>
              <!-- statistic -->
              <div
                class="lg_col-start-7 lg_col-span-8 grid grid-cols-6 lg_grid-cols-8 gap-4 place-items-center items-center shrink grow-0"
              >
                <div
                  class="lg_col-start-1 col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"
                >
                  <div class="text-gray-500 align-center">Voters</div>
                  <div class="text-4xl font-light align-center lining-nums">${this.subject.fansNumber}</div>
                </div>
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"
                >
                  <div class="text-gray-500 align-center">Tickets</div>
                  <div class="text-4xl font-light align-center lining-nums">${this.subject.supply}</div>
                </div>
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"
                >
                  <div class="text-gray-500 align-center">Volume</div>
                  <div class="text-4xl font-light align-center lining-nums">
                    ${formatUnits(this.subject.totalVoteValue)}
                  </div>
                </div>
                <!--  -->
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"
                >
                  <div class="text-gray-500 align-center">Price</div>
                  <div class="text-4xl font-light align-center lining-nums">${(+this.subject.supply + 1) / 10}</div>
                </div>
              </div>
            </div>`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
