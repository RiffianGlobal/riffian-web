import { ThemeElement, customElement, html, repeat, state, when, classMap } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import './dialog'
import { userVotes } from './action'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '~/components/rewards/claim'
import emitter from '@lit-web3/base/emitter'
import style from './list.css?inline'
@customElement('user-votes-list')
export class UserVotesList extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() uVotes: any = []
  @state() dialog = false
  @state() currentAlbum = { id: '', votes: 0, url: '' }
  @state() pending = false

  get disabled() {
    return !bridgeStore.bridge.account
  }

  async connectedCallback() {
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
    let { userSubjectVotes } = await userVotes(bridgeStore.bridge.account!)
    this.uVotes = userSubjectVotes
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
          html`<ul role="list" class="py-6">
          <li class="flex header p-1">
            <div class="w-16">Collection</div>
            <div class="flex-auto text-right pr-3">Author</div>
            <div class="flex-none w-24 text-right">Tickets</div>
            <div class="flex-none w-24 text-right">Holding</div>
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
              this.uVotes,
              (item: any, i) =>
                html`<li
                  class="item flex py-2 items-center cursor-pointer"
                  @click=${() => {
                    if (this.disabled) {
                      emitter.emit('connect-wallet')
                    } else {
                      location.href = '/track/' + item.subject.id
                    }
                  }}
                >
                  <div class="flex-initial flex">
                    <div class="w-[3.75rem] h-[3.75rem] mr-4 rounded-lg">
                      <img-loader .src=${item.subject.image}></img-loader>
                    </div>
                    <div>
                      <p class="name truncate mt-2">${item.subject.name}</p>
                      <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                    </div>
                  </div>
                  <div class="flex-auto text-right pr-3">
                    <ui-address .address="${item.subject.creator.address}" short avatar></ui-address>
                  </div>
                  <div class="flex-none w-24 font-light text-right">${item.subject.supply}</div>
                  <div class="flex-none w-24 font-light text-right">${item.holding}</div>
                </li>`
            )}
          </div>`
      )}
    </div>`
  }
}
