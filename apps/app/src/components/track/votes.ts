import {
  ThemeElement,
  classMap,
  customElement,
  html,
  property,
  repeat,
  state,
  when
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { screenStore } from '@lit-web3/base/screen'
import { trackVotes } from './action'
import { goto } from '@lit-web3/router'
import emitter from '@lit-web3/base/emitter'
import { formatUnits } from 'ethers'
import { throttle } from '@riffian-web/ethers/src/utils'
// Components
import '~/components/top/dialog'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'

import style from './list.css?inline'
@customElement('track-votes')
export class TrackInfo extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  bindBridge: any = new StateController(this, bridgeStore)

  @property({ type: Boolean }) weekly = false
  @property({ type: String }) trackAddress = ''

  @state() subjectData: any = {}
  @state() votes: any = []
  @state() pending = false
  @state() inited = false
  @state() prompt = false
  @state() promptMessage: string = ''

  get isMobi() {
    return screenStore.isMobi
  }
  get disabled() {
    return !bridgeStore.bridge.account
  }
  get loading() {
    return !this.inited && this.pending
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  fetch = async () => {
    this.pending = true
    try {
      let result = await trackVotes(this.trackAddress)
      this.votes = result.subject.userVotes
      this.subjectData = result.subject
    } catch (e: any) {
      console.error(e)
      this.promptMessage = e
      this.prompt = true
    } finally {
      this.pending = false
      this.inited = true
    }
  }

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/user/${item.user.address}`)
    }
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
    return html`<div role="list" class="ui-list ${classMap(this.$c([this.loading ? 'loading' : 'hover']))}">
        <div class="flex header">
          ${when(!this.isMobi, () => html`<div class="w-11 text-center">Rank</div>`)}
          <div class="address flex-auto">Address</div>
          <div class="num flex-none w-20 md_w-28">Comsumption</div>
          <!-- Close #10 -->
          <!-- <div class="num flex-none w-20 md_w-28">Earning</div> -->
        </div>
        ${when(
          this.loading,
          () =>
            html`<div name="Loading" class="doc-intro">
              <div class="flex flex-col gap-8 m-6">
                <div name="Loading" class="doc-intro"><loading-skeleton num="4"></loading-skeleton></div>
              </div>
            </div>`,
          () =>
            html` ${repeat(
              this.votes,
              (item, i) => html`
                <div class="item flex py-2.5" @click=${() => this.go2(item)}>
                  ${when(
                    !this.isMobi,
                    () => html`<div class="flex-none w-11 text-center text-sm font-light opacity-70">${i + 1}</div>`
                  )}
                  <div class="flex-auto">
                    <ui-address .address="${item.user.address}" short avatar class="text-sm md_text-base"></ui-address>
                  </div>
                  <div class="num flex-none">
                    <p class="num truncate md_mt-2">${parseFloat((+formatUnits(item.volumeVote)).toFixed(2))}</p>
                  </div>
                  <!-- Close #10 -->
                  <!-- <div class="num flex-none w-16 md_w-28">
                    <p class="num truncate md_mt-2">
                      ${parseFloat((+formatUnits(item.user.rewardClaimed)).toFixed(2))}
                    </p>
                  </div> -->
                </div>
              `
            )}`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`
  }
}
