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
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import '~/components/rewards/claim'
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
            html`<ul role="list" class="ui-list hover py-5">
              <li class="flex header">
                <div class="w-16">Rank</div>
                <div class="address flex-auto">Addr</div>
                <div class="num flex-none">Comsumption<span class="ml-1 text-xs opacity-70">(ST)</span></div>
                <div class="num flex-none w-28">Earning<span class="ml-1 text-xs opacity-70">(ST)</span></div>
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
                    class="item flex py-2.5"
                    @click=${() => {
                      if (this.disabled) {
                        emitter.emit('connect-wallet')
                      } else {
                        location.href = '/user/' + item.user.address
                      }
                    }}
                  >
                    <div class="flex-none w-16 pl-4 text-sm font-light opacity-70">${i + 1}</div>
                    <div class="flex-auto">
                      <ui-address .address="${item.user.address}" short avatar class="text-base"></ui-address>
                    </div>
                    <div class="num flex-none">
                      <p class="name truncate mt-2">${formatUnits(item.volumeVote, 18)}</p>
                      
                      </p>
                    </div>
                    <div class="num flex-none w-28"><p class="name truncate mt-2">${formatUnits(
                      item.user.rewardClaimed,
                      18
                    )}</p></div>
                  </li> `
              )}
            </ul>`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
