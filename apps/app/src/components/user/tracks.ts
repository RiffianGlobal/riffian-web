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
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
import { screenStore } from '@lit-web3/base/screen'
import { format } from '~/lib/dayjs'
import { asyncReplace } from 'lit/directives/async-replace.js'
import { timeAgo } from '~/lib/dayjs'

import { tracks } from './action'
import { formatUnits } from 'ethers'
import { goto } from '@lit-web3/router'
import emitter from '@lit-web3/base/emitter'

// Components
import '~/components/top/dialog'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import { toast } from '@riffian-web/ui/toast'

import style from './tracks.css?inline'
@customElement('track-list')
export class TrackInfo extends ThemeElement(style) {
  bindWallet: any = new StateController(this, walletStore)
  bindScreen: any = new StateController(this, screenStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) address = ''
  @state() trackList: any = []
  @state() pending = false
  @state() err = ''
  @state() ts = 0

  get isMobi() {
    return screenStore.screen.isMobi
  }

  get disabled() {
    return !walletStore.account
  }

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/track/${item.address}`)
    }
  }

  timeAgo = async function* (timestamp: number | string) {
    while (true) {
      yield timeAgo(timestamp)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  itemMobi = (item: any) => {
    return html`<div class="w-full overflow-hidden flex gap-x-2">
      <div class="w-[3.25rem] h-[3.25rem] mr-2 rounded-lg">
        <img-loader src=${item.image} class="w-[3.25rem] rounded-lg"></img-loader>
      </div>
      <div class="flex-auto flex flex-col">
        <div class="flex truncate items-center">
          <p class="truncate">${item.name}</p>
          <a href=${item.uri} class="flex-none ml-1.5" target="_blank"
            ><i class="text-lg mdi mdi-play-circle-outline"></i
          ></a>
        </div>
        <!-- other info -->
        <div class="mt-0.5 text-xs text-gray-300/60 opacity-80">${asyncReplace(this.timeAgo(item.createdAt))}</div>
      </div>
      <div class="w-16 flex-none justify-center text-right">
        <div class="text-base">${item.totalVal}</div>
        <div class="text-xs opacity-80">${item.supply}<span class="text-gray-300/60 ml-1">tickets</span></div>
      </div>
    </div>`
  }

  init = async () => {
    this.pending = true
    try {
      let {
        user: { subjectsCreated: subjects }
      } = await tracks(this.address)
      this.trackList = subjects.map((item: any) => {
        const { totalVoteValue: totalVal } = item
        return { ...item, totalVal: formatUnits(totalVal) }
      })
    } catch (e: any) {
      this.err = e.message || e.msg || e
      toast.add({ summary: 'Fetch failed', detail: this.err })
    } finally {
      this.pending = false
      this.ts++
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
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
            <div class="flex-none w-16">Index</div>
            <div class="flex-auto">Name</div>
            <div class="flex-none w-40">Created</div>
            <div class="num flex-none">Voters</div>
            <div class="num flex-none">Tickets</div>
            <div class="num flex-none">Vote Value</div>
          </div>
        `
      )}
      ${when(
        !this.ts && !this.trackList.length,
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
              html`<div class="item flex py-2 pr-2 items-center cursor-pointer" @click=${() => this.go2(item)}>
                ${when(
                  !this.isMobi,
                  () => html`
                    <div class="flex-none w-16 pl-4 text-sm font-light opacity-75">
                      ${i + 1}
                      ${when(this.trackList.length > 3 && i < 3, () => html`<i class="mdi mdi-fire text-red-400"></i>`)}
                    </div>
                    <div class="flex-auto flex">
                      <div class="w-[3.25rem] h-[3.25rem] mr-4 rounded-lg">
                        <img-loader src=${item.image} class="rounded-lg"></img-loader>
                      </div>
                      <div>
                        <p class="name truncate">${item.name}</p>
                        <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                      </div>
                    </div>
                    <div class="flex-none md_w-40 text-xs text-gray-300/60">${format(item.createdAt)}</div>
                    <div class="num text-sm truncate">${item.fansNumber}</div>
                    <div class="num text-sm truncate">${item.supply}</div>
                    <div class="num text-sm ">${item.totalVal}</div>
                  `,
                  () => html`${this.itemMobi(item)}`
                )}
              </div>`
          )}
        `
      )}
    </div>`
  }
}
