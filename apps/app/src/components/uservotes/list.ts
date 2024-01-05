import {
  TailwindElement,
  customElement,
  html,
  repeat,
  state,
  when,
  classMap
} from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import './dialog'
import { userVotes } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '~/components/rewards/claim'
import emitter from '@riffian-web/core/src/emitter'
import style from './list.css?inline'
@customElement('user-votes-list')
export class UserVotesList extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() userVotes: any = []
  @state() dialog = false
  @state() currentAlbum = { id: '', votes: 0, url: '' }
  @state() pending = false

  get disabled() {
    return !bridgeStore.account
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
    bridgeStore.bridge.subscribe(this.init)
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  init = async () => {
    if (this.disabled) return
    this.pending = true
    let result = await userVotes(bridgeStore.account!)
    this.userVotes = result.userSubjectVotes
    this.pending = false
  }

  close = () => (this.dialog = false)

  render() {
    return html` <div>
      ${when(
        this.pending,
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
        !this.pending,
        () =>
          html`<ul role="list">
          <li class="flex header p-1">
            <div class="w-16">Collection</div>
            <div class="flex-auto text-right pr-3">Author</div>
            <div class="flex-none w-16 text-right">Tickets</div>
            <div class="flex-none w-16 text-right">Holding</div>
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
              this.userVotes,
              (item: any, i) =>
                html`<li
                  class="flex py-2 items-center cursor-pointer ${classMap({
                    'bg-zinc-800/50': i % 2
                  })}"
                  @click=${() => {
                    if (this.disabled) {
                      emitter.emit('connect-wallet')
                    } else {
                      location.href = '/track/' + item.subject.id
                    }
                  }}
                >
                  <div class="flex-initial flex">
                    <div class="w-[4.6rem] h-[4.6rem] mr-4">
                      <img-loader .src=${item.subject.image}></img-loader>
                    </div>
                    <div>
                      <p class="name truncate mt-2">${item.subject.name}</p>
                      <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                    </div>
                  </div>
                  <div class="flex-auto text-right pr-3 text-lg">
                    <ui-address .address="${item.subject.creator.address}" short avatar></ui-address>
                  </div>
                  <div class="flex-none w-16 text-2xl font-light text-right">${item.subject.supply}</div>
                  <div class="flex-none w-16 text-2xl font-light text-right">${item.holding}</div>
                </li>`
            )}
          </div>`
      )}
    </div>`
  }
}
