import {
  ThemeElement,
  customElement,
  html,
  repeat,
  state,
  when,
  classMap,
  property
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { screenStore } from '@lit-web3/base/screen'
import { goto } from '@lit-web3/router'
// Components
import './dialog'
import { userVotes } from './action'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'

import emitter from '@lit-web3/base/emitter'
import style from './list.css?inline'
@customElement('user-votes-list')
export class UserVotesList extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindScreen: any = new StateController(this, screenStore)

  @property() acc!: string

  @property() by = ''
  @property() dir = ''

  @state() uVotes: any = []
  @state() dialog = false
  @state() currentAlbum = { id: '', votes: 0, url: '' }
  @state() pending = false

  get isMobi() {
    return screenStore.screen.isMobi
  }

  get disabled() {
    return !bridgeStore.bridge.account
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  fetch = async () => {
    if (this.disabled) return
    this.pending = true
    try {
      const userSubjectVotes = await userVotes(this.acc, { orderBy: this.by })
      this.uVotes = userSubjectVotes.map((item: any) => ({
        ...item,
        price: (+item.subject.supply + 1) / 10
      }))
    } catch {
    } finally {
      this.pending = false
    }
  }

  close = () => (this.dialog = false)

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/track/${item.subject.id}`)
    }
  }

  itemMobi = (item: any) => {
    return html`<div class="w-full overflow-hidden flex gap-x-2">
      <div class="w-[3.25rem] h-[3.25rem] mr-2 rounded-lg">
        <img-loader src=${item.subject.image} class="w-[3.25rem] rounded-lg"></img-loader>
      </div>
      <div class="flex-auto flex flex-col">
        <div class="flex truncate items-center">
          <p class="truncate">${item.subject.name}</p>
          <a href=${item.subject.uri} class="flex-none ml-1.5" target="_blank"
            ><i class="text-lg mdi mdi-play-circle-outline"></i
          ></a>
        </div>
        <!-- other info -->
        <div class="mt-0.5 text-xs opacity-80">
          <ui-address .address="${item.subject.creator.address}" short avatar></ui-address>
        </div>
      </div>
      <div class="num justify-center self-center">
        <div class="text-sm">${item.subject.supply}</div>
        <span class="text-xs opacity-80 text-gray-300/60">tickets</span>
      </div>
    </div>`
  }

  connectedCallback() {
    super.connectedCallback()
    this.fetch()
    bridgeStore.bridge.subscribe(this.fetch)
    emitter.on('manual-change', this.fetch)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('manual-change', this.fetch)
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
            <div class="flex-auto">Collection</div>
            <div class="author flex-none w-32 text-right">Price</div>
            <div class="num flex-none">Tickets</div>
            <div class="num flex-none">Holding</div>
          </div>
        `
      )}
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
            this.uVotes,
            (item: any) => html`
              <div class="item flex items-center pr-0.5" @click=${() => this.go2(item)}>
                ${when(
                  !this.isMobi,
                  () => html`
                    <div class="flex-auto flex items-center">
                      <img-loader
                        .src=${item.subject.image}
                        class="w-[3.25rem] h-[3.25rem] rounded-lg mr-4"
                      ></img-loader>
                      <div>
                        <p class="name truncate mb-0.5">${item.subject.name}</p>
                        ${when(
                          item.subject.uri,
                          () =>
                            html`<a href=${item.subject.uri} target="_blank">
                              <span class="icon mt-1"
                                ><i class="mdi mdi-play-circle-outline text-lg opacity-80 hover_opacity-100"></i
                              ></span>
                            </a>`
                        )}
                      </div>
                    </div>
                    <div class="author flex-none text-right">${item.price}</div>
                    <div class="num flex-none font-light">${item.subject.supply}</div>
                    <div class="num flex-none font-light">${item.holding}</div>
                  `,
                  () => html`${this.itemMobi(item)}`
                )}
              </div>
            `
          )}
        `
      )}
    </div>`
  }
}
