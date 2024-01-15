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
import { goto } from '@lit-web3/router'
// Components
import '~/components/top/dialog'
import { tracks } from './action'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import emitter from '@lit-web3/base/emitter'
import style from './tracks.css?inline'

@customElement('track-list')
export class TrackInfo extends ThemeElement(style) {
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
      this.trackList = result.user?.subjectsCreated
      this.userData = result.user
    } catch (e: any) {
      console.error(e)
      this.promptMessage = e
      this.prompt = true
      return
    } finally {
      this.pending = false
    }
  }

  close = () => {
    this.init()
  }

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/track/${item.address}`)
    }
  }

  render() {
    return html`<div role="list" class="ui-list py-6 ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
        <div class="flex header">
          <div class="w-16">Index</div>
          <div class="flex-auto">Name</div>
          <div class="flex-none w-40">Created</div>
          <div class="flex-none w-24 text-right">Tickets</div>
          <div class="flex-none w-24 text-right">Voters</div>
          <!-- ${when(
            this.pending,
            () =>
              html`<div>
                <i class="text-sm mdi mdi-loading"></i>
                <div></div>
              </div>`
          )} -->
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
          () => html`
            ${repeat(
              this.trackList,
              (item: any, i) =>
                html`<div class="item flex py-2 pr-2 items-center cursor-pointer " @click=${() => this.go2(item)}>
                  <div class="flex-none w-16 pl-4 text-sm font-light opacity-75">${i + 1}</div>
                  <div class="flex-auto flex">
                    <div class="w-[3.75rem] h-[3.75rem] mr-4 rounded-lg">
                      <img-loader sizes="60px, 60px" src=${item.image} class="rounded-lg"></img-loader>
                    </div>
                    <div>
                      <p class="name truncate mt-2">${item.name}</p>
                      <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                    </div>
                  </div>
                  <div class="flex-none w-40 text-sm font-light text-neutral-400">
                    ${new Date(item.createdAt * 1000).toLocaleString()}
                  </div>
                  <div class="flex-none w-24 text-right text-base font-light">
                    <p class="name truncate mt-2">${item.fansNumber}</p>
                  </div>
                  <div class="flex-none w-24 text-right text-base font-light">
                    <p class="name truncate mt-2">${item.supply}</p>
                  </div>
                </div>`
            )}
          `
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`
  }
}
