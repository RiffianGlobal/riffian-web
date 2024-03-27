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
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
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
  bindWallet: any = new StateController(this, walletStore)
  bindScreen: any = new StateController(this, screenStore)

  @property() acc!: string

  @property() by = ''
  @property() dir = ''

  @state() subjects: any = []
  @state() dialog = false
  @state() currentAlbum = { id: '', votes: 0, url: '' }
  @state() pending = false

  get isMobi() {
    return screenStore.isMobi
  }

  get disabled() {
    return !walletStore.account
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  fetch = async () => {
    if (this.disabled) return
    this.pending = true
    try {
      const { subjects } = await userVotes(this.acc, { orderBy: this.by })
      this.subjects = subjects
    } catch (e) {
      console.log(e)
    } finally {
      this.pending = false
    }
  }

  close = () => (this.dialog = false)

  go2 = (subject: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/track/${subject.subject.id}`)
    }
  }

  // itemMobi = (item: any) => {
  //   return html`<div class="w-full overflow-hidden flex gap-x-2">
  //     <div class="w-[3.25rem] h-[3.25rem] mr-2 rounded-lg">
  //       <img-loader src=${subject.subject.image} class="w-[3.25rem] rounded-lg"></img-loader>
  //     </div>
  //     <div class="flex-auto flex flex-col">
  //       <div class="flex truncate items-center">
  //         <p class="truncate">${subject.subject.name}</p>
  //         <a href=${subject.subject.uri} class="flex-none ml-1.5" target="_blank"
  //           ><i class="text-lg mdi mdi-play-circle-outline"></i
  //         ></a>
  //       </div>
  //       <!-- other info -->
  //       <div class="mt-0.5 text-xs opacity-80">
  //         <ui-address .address="${subject.subject.creator.address}" short avatar></ui-address>
  //       </div>
  //     </div>
  //     <div class="num justify-center self-center">
  //       <div class="text-sm">${subject.subject.supply}</div>
  //       <span class="text-xs opacity-80 text-gray-300/60">tickets</span>
  //     </div>
  //   </div>`
  // }

  connectedCallback() {
    super.connectedCallback()
    this.fetch()
    emitter.on('block-world', this.fetch)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('block-world', this.fetch)
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
            <div class="num">Price</div>
            <div class="num">Tickets</div>
            <div class="num">Holding</div>
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
            this.subjects,
            (subject: any, i) => html`
              <div class="isubject-brief" @click=${() => this.go2(subject)}>
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
                      <ui-address .address=${subject.cooked.address} short doid></ui-address>
                    </p>
                  </div>
                </div>
                <!-- Metadata -->
                ${when(
                  this.isMobi,
                  () =>
                    html`<div class="subject-intro-cnt num num2 truncate">
                      <span class="subject-line1">${subject.holding}</span>
                      <span class="block pt-0.5 text-xs"
                        >${subject.supply}<span class="text-gray-300/60 ml-1">tickets</span></span
                      >
                    </div>`,
                  () =>
                    html`<p class="num date">${subject.cooked.price}</p>
                      <p class="num">${subject.supply}</p>
                      <p class="num">${subject.holding}</p>`
                )}
              </div>
            `
          )}
        `
      )}
    </div>`
  }
}
