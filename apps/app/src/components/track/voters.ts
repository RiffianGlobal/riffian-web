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
import '~/components/top/dialog'
import { voters } from './action'
import { goto } from '@lit-web3/router'
// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import emitter from '@lit-web3/base/emitter'
import style from './list.css?inline'
import { formatUnits } from 'ethers'
@customElement('voter-list')
export class TrackInfo extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) trackAddress = ''
  @state() subjectData: any = {}
  @state() voteList: any = []
  @state() pending = false
  @state() prompt = false
  @state() promptMessage: string = ''

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

  init = async () => {
    this.pending = true
    try {
      let result = await voters(this.trackAddress)
      this.voteList = result.subject.userVotes
      this.subjectData = result.subject
    } catch (e: any) {
      console.error(e)
      this.promptMessage = e
      this.prompt = true
      return
    }
    this.pending = false
  }

  close = () => {
    this.init()
  }

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/user/${item.user.address}`)
    }
  }

  render() {
    return html`<div role="list" class="ui-list ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
        <div class="flex header">
          <div class="w-16">Rank</div>
          <div class="address flex-auto">Address</div>
          <div class="num flex-none">Comsumption</div>
          <div class="num flex-none w-28">Earning</div>
        </div>
        ${when(
          this.pending,
          () =>
            html`<div name="Loading" class="doc-intro">
              <div class="flex flex-col gap-8 m-6">
                ${repeat(
                  [...Array(3).keys()],
                  () => html`<div name="Loading" class="doc-intro"><loading-skeleton num="4"></loading-skeleton></div>`
                )}
              </div>
            </div>`,
          () =>
            html` ${repeat(
              this.voteList,
              (item, i) => html`
                <div class="item flex py-2.5" @click=${() => this.go2(item)}>
                  <div class="flex-none w-16 pl-4 text-sm font-light opacity-70">${i + 1}</div>
                  <div class="flex-auto">
                    <ui-address .address="${item.user.address}" short avatar class="text-base"></ui-address>
                  </div>
                  <div class="num flex-none">
                    <p class="num truncate mt-2">${parseFloat((+formatUnits(item.volumeVote)).toFixed(4))}</p>
                  </div>
                  <div class="num flex-none w-28">
                    <p class="num truncate mt-2">${parseFloat((+formatUnits(item.user.rewardClaimed)).toFixed(4))}</p>
                  </div>
                </div>
              `
            )}`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`
  }
}
