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
import { tracks } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/dialog/prompt'
import '~/components/rewards/claim'
import emitter from '@riffian-web/core/src/emitter'
import { formatUnits } from 'ethers'
@customElement('track-list')
export class TrackInfo extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) address = ''
  @state() userData: any = {}
  @state() trackList: any = []
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
      let result = await tracks(this.address)
      this.trackList = result.user.subjectsCreated
      this.userData = result.user
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
          this.pending && !this.userData,
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
          this.userData,
          () =>
            html`<ul role="list">
              <li class="flex header p-1">
                <div class="w-16">Index</div>
                <div class="flex-auto">Name</div>
                <div class="flex-auto text-right pr-3">Tickets</div>
                <div class="flex-none w-16 text-right">Voters</div>
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
                this.trackList,
                (item: any, i) =>
                  html`<li
                    class="flex py-2 items-center cursor-pointer ${classMap({
                      'bg-zinc-800/50': i % 2
                    })}"
                    @click=${() => {
                      if (this.disabled) {
                        emitter.emit('connect-wallet')
                      } else {
                        location.href = '/track/' + item.address
                      }
                    }}
                  >
                    <div class="flex-none w-16 pl-4 text-lg font-light">${i + 1}</div>
                    <div class="flex-initial flex">
                      <div class="w-[4.6rem] h-[4.6rem] mr-4">
                        <img-loader sizes="74px, 74px" src=${item.uri}></img-loader>
                      </div>
                      <div>
                        <p class="name truncate mt-2">${item.name}</p>
                        <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                      </div>
                    </div>
                    <div class="flex-auto text-right pr-3 text-lg font-light">
                      <p class="name truncate mt-2">${item.fansNumber}</p>
                    </div>
                    <div class="flex-none w-16 text-right text-lg font-light">
                      <p class="name truncate mt-2">${item.supply}</p>
                    </div>
                  </li> `
              )}
            </ul>`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
