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
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
import { throttle } from '@riffian-web/ethers/src/utils'
import { screenStore } from '@lit-web3/base/screen'
import { asyncReplace } from 'lit/directives/async-replace.js'
import { timeAgo } from '~/lib/dayjs'
import { tracks } from './action'
import { formatUnits } from 'ethers'
import { goto } from '@lit-web3/router'
import emitter from '@lit-web3/base/emitter'
// Components
import '~/components/top/dialog'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import { toast } from '@riffian-web/ui/toast'
import '~/components/top/subject-brief'

import style from './tracks.css?inline'
@customElement('track-list')
export class TrackInfo extends ThemeElement(style) {
  bindWallet: any = new StateController(this, walletStore)
  bindScreen: any = new StateController(this, screenStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) address = ''
  @state() subjects: any = []
  @state() pending = false
  @state() err = ''
  @state() ts = 0

  get isMobi() {
    return screenStore.screen.isMobi
  }

  get disabled() {
    return !walletStore.account
  }

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/track/${item.address}`)
    }
  }

  timeAgo = async function* (timestamp: number | string) {
    while (true) {
      yield timeAgo(timestamp)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  init = async () => {
    this.pending = true
    try {
      const { subjects } = await tracks(this.address)
      this.subjects = subjects
    } catch (e: any) {
      this.err = e.message || e.msg || e
      toast.add({ summary: 'Fetch failed', detail: this.err })
    } finally {
      this.pending = false
      this.ts++
    }
  }
  listen = throttle(this.init)

  async connectedCallback() {
    super.connectedCallback()
    await this.init()
    emitter.on('block-world', this.listen)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('block-world', this.listen)
  }
  render() {
    return html`<div
      role="list"
      class="ui-list py-4 md_py-6 ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}"
    >
      ${when(
        !this.isMobi,
        () => html`
          <div class="flex header">
            <div class="subject-intro">Collection</div>
            <div class="num date">Uploaded Time</div>
            <div class="num">Voters</div>
            <div class="num">Tickets</div>
            <div class="num num2">Vote Value</div>
          </div>
        `
      )}
      ${when(
        !this.ts && !this.subjects.length,
        () =>
          html`<div name="Loading" class="doc-intro">
            <div class="flex flex-col gap-8 m-6">
              ${repeat(
                [...Array(3).keys()],
                () => html`<div name="Loading" class="doc-intro"><loading-skeleton num="4"></loading-skeleton></div>`
              )}
            </div>
          </div>`,
        () => html`
          ${repeat(
            this.subjects,
            (subject: any, i) =>
              html`<div class="subject-brief" @click=${() => this.go2(subject)}>
                <!-- Brief -->
                <div class="subject-intro">
                  <!-- Cover -->
                  <div class="subject-cover">
                    <img-loader src=${subject.cooked.src} class="rounded-lg"></img-loader>
                    ${when(subject.cooked.src, () => html`<i class="subject-play mdi mdi-play-circle"></i>`)}
                  </div>
                  <!-- Content -->
                  <div class="subject-intro-cnt">
                    <p class="subject-name">${subject.name}</p>
                    <p class="subject-minor">
                      ${when(
                        this.isMobi,
                        () => html`<span class="block pt-1">${asyncReplace(this.timeAgo(subject.createdAt))}</span>`,
                        () => html`<span class="mr-1 text-xs opacity-80">Price:</span>${subject.cooked.price}`
                      )}
                    </p>
                  </div>
                </div>
                <!-- Metadata -->
                ${when(
                  this.isMobi,
                  () =>
                    html`<div class="subject-intro-cnt num num2 truncate">
                      <span class="subject-line1">${subject.cooked.total}</span>
                      <span class="block pt-0.5 text-xs"
                        >${subject.cooked.price}<span class="text-gray-300/60 ml-1">tickets</span></span
                      >
                    </div>`,
                  () =>
                    html`<p class="num date">${subject.cooked.date}</p>
                      <p class="num">${subject.fansNumber}</p>
                      <p class="num">${subject.cooked.price}</p>
                      <p class="num num2">${subject.cooked.total}</p>`
                )}
              </div>`
          )}
        `
      )}
    </div>`
  }
}
