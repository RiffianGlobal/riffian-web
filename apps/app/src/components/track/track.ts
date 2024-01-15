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
import { tweetStore, type Social } from '~/components/top/tweet'

const defErr = () => ({ tx: '' })
@customElement('track-detail')
export class TrackDetail extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindTweets: any = new StateController(this, tweetStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) trackAddress = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: Promise<any> | undefined
  // @state() retreatDisabled = true
  @state() social: Social | undefined
  @state() subject: any = { totalVoteValue: '0' }
  @state() voteList: any = []
  @state() pending = false
  @state() prompt = false
  @state() dialog = false
  @state() promptMessage: string = ''
  @state() err = defErr()
  @state({ type: String }) actionType = ''
  @state() ts = 0

  get disabled() {
    return !bridgeStore.bridge.account
  }

  get voteEnable() {
    return this.ts && !this.disabled
  }
  get retreatEnable() {
    return this.ts && +formatUnits(this.myVotes, 0) > 0
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  async readFromTwitter() {
    const { uri } = this.subject.creator.socials[0] ?? {}
    const social = await tweetStore.get(uri)
    if (social) Object.assign(social, { verified: social.address.includes(this.subject.creator.address) })
    this.social = social
  }

  async getPrice() {
    try {
      this.votes = albumData(this.trackAddress).then((result) => result[4])
      this.myVotes = await myVotes(this.trackAddress).then((votes) => {
        // if (votes > 0) this.retreatDisabled = false
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
      await this.getPrice()
      await this.readFromTwitter()
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
    this.init()
  }

  setAction = (action) => (this.actionType = action)

  popAction = (action: String = 'vote') => {
    if ((action == this.actionType && this.dialog) || !this[`${action}Enable`]) return
    this.setAction(action)

    this.dialog = true
  }
  open = () => window.open(`${this.subject.uri}`, '_blank')

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
            html`<div class="grid lg_grid-cols-13 gap-2">
              <!-- meta info -->
              <div class="lg_col-span-6 flex gap-6">
                <div class="w-32 h-32 rounded-xl bg-white/10">
                  <img-loader src=${this.subject.image} class="w-32 h-32 rounded-xl"></img-loader>
                </div>
                <div class="flex flex-col justify-start ml-4">
                  <div class="text-xl mb-1.5">${this.subject.name ?? '-'}</div>
                  <!-- Author -->
                  ${when(
                    this.social,
                    () =>
                      html`<div class="inline-flex text-base font-normal mb-0.5">
                          ${this.social?.name}
                          ${when(
                            this.social?.verified,
                            () =>
                              html`<span class="ml-0.5"
                                ><i class="mdi mdi-check-decagram text-sm text-green-600"></i
                              ></span>`
                          )}
                        </div>
                        <a class="text-base font-normal text-blue-300" href="${this.social?.url}" target="_blank"
                          >@${this.social?.id}</a
                        >`,
                    () => html`-`
                  )}
                  ${when(
                    this.subject.uri,
                    () => html`
                      <div class="my-1">
                        <ui-button icon lg @click=${this.open}><i class="mdi mdi-play-circle-outline"></i></ui-button>
                      </div>
                    `
                  )}
                  <div class="mt-2 flex gap-3">
                    ${when(
                      this.voteEnable,
                      () => html`
                        <ui-button
                          sm
                          class="outlined"
                          ?disabled="${!this.voteEnable}"
                          @click=${() => this.popAction('vote')}
                          >VOTE</ui-button
                        >
                      `
                    )}
                    ${when(
                      this.retreatEnable,
                      () =>
                        html` <ui-button
                          sm
                          class="outlined"
                          ?disabled="${!this.retreatEnable}"
                          @click=${() => this.popAction('retreat')}
                          >RETREAT</ui-button
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
                          author=${this.subject.creator?.address}
                          @close=${this.close}
                        ></vote-album-dialog>`
                    )}
                  </div>
                </div>
              </div>
              <!-- statistic -->
              <div
                class="lg_col-start-7 lg_col-span-7 grid grid-cols-6 lg_grid-cols-8 gap-4 place-items-center items-center"
              >
                <div
                  class="lg_col-start-3 col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"
                >
                  <div class="text-base text-gray-500 align-center">Voters</div>
                  <div class="text-4xl align-center lining-nums">${this.subject.fansNumber}</div>
                </div>
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"
                >
                  <div class="text-base text-gray-500 align-center">Tickets</div>
                  <div class="text-4xl align-center lining-nums">${this.subject.supply}</div>
                </div>
                <div
                  class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"
                >
                  <div class="text-base text-gray-500 align-center">Total Vote Value</div>
                  <div class="text-4xl align-center lining-nums">${formatUnits(this.subject.totalVoteValue, 18)}</div>
                </div>
              </div>
            </div>`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
