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

  @property() by = ''
  @property() dir = ''

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
    try {
      const userSubjectVotes = await userVotes('', { orderBy: this.by })
      this.uVotes = userSubjectVotes
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

  render() {
    return html`<div role="list" class="ui-list ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
      <div class="flex header">
        <div class="flex-auto">Collection</div>
        <div class="author flex-none w-32 text-right">Author</div>
        <div class="num flex-none">Tickets</div>
        <div class="num flex-none">Holding</div>
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
            this.uVotes,
            (item: any) => html`
              <div class="item flex items-center pr-0.5" @click=${() => this.go2(item)}>
                <div class="flex-auto flex items-center">
                  <img-loader .src=${item.subject.image} class="w-[3.25rem] h-[3.25rem] rounded-lg mr-4"></img-loader>
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
                <div class="author flex-none text-right">
                  <ui-address .address="${item.subject.creator.address}" short avatar></ui-address>
                </div>
                <div class="num flex-none font-light">${item.subject.supply}</div>
                <div class="num flex-none font-light">${item.holding}</div>
              </div>
            `
          )}
        `
      )}
    </div>`
  }
}
