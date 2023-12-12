import {
  TailwindElement,
  classMap,
  customElement,
  html,
  property,
  repeat,
  state,
  when
} from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { voters } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/dialog/prompt'
import '~/components/rewards/claim'
import emitter from '@riffian-web/core/src/emitter'
import style from './list.css?inline'
import { formatUnits } from 'ethers'
@customElement('voter-list')
export class TrackInfo extends TailwindElement(style) {
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

  render() {
    return html`<div>
        ${when(
          this.pending && !this.subjectData,
          () =>
            html`<div name="Loading" class="doc-intro">
              <div class="flex flex-col gap-8 m-8">
                <loading-skeleton num="3"></loading-skeleton>
                <loading-skeleton num="3"></loading-skeleton>
                <loading-skeleton num="3"></loading-skeleton>
              </div>
            </div>`
        )}
        ${when(
          this.subjectData,
          () =>
            html`<ul role="list">
              <li class="flex header p-1">
                <div class="w-16">Rank</div>
                <div class="flex-auto">Addr</div>
                <div class="flex-auto text-right pr-3">Comsumption</div>
                <div class="flex-none w-16 text-right">Earning</div>
                ${when(
                  this.pending,
                  () =>
                    html`<div>
                      <i class="text-sm mdi mdi-loading"></i>
                      <div></div>
                    </div>`
                )}
              </li>
              ${repeat(
                this.voteList,
                (item: any, i) =>
                  html`<li
                    class="flex py-2 items-center cursor-pointer ${classMap({
                      'bg-zinc-800/50': i % 2
                    })}"
                    @click=${() => {
                      if (this.disabled) {
                        emitter.emit('connect-wallet')
                      } else {
                      }
                    }}
                  >
                    <div class="flex-none w-16 pl-4 text-lg font-light">${i + 1}</div>
                    <div class="flex-initial flex">
                        <ui-address .address="${item.user.address}" short avatar></ui-address>
                    </div>
                    <div class="flex-auto text-right pr-3">
                      <p class="text-2xl">
                      <p class="name truncate mt-2">${formatUnits(item.volumeVote, 18)} ST</p>
                      
                      </p>
                    </div>
                    <div class="flex-none w-16 text-lg font-light"><p class="name truncate mt-2">${formatUnits(
                      item.user.rewardClaimed,
                      18
                    )} ST</p></div>
                  </li> `
              )}
            </ul>`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
