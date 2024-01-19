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
import { format } from '~/lib/dayjs'

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
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) address = ''
  @state() trackList: any = []
  @state() pending = false
  @state() err = ''
  @state() ts = 0

  get disabled() {
    return !bridgeStore.bridge.account
  }

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      goto(`/track/${item.address}`)
    }
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
    return html`<div role="list" class="ui-list py-6 ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
      <div class="flex header">
        <div class="w-16">Index</div>
        <div class="flex-auto">Name</div>
        <div class="flex-none w-40">Created</div>
        <div class="flex-none w-20 text-right">Voters</div>
        <div class="flex-none w-24 text-right">Tickets</div>
        <div class="flex-none w-24 text-right">Vote Value</div>
      </div>
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
              html`<div class="item flex py-2 pr-2 items-center cursor-pointer " @click=${() => this.go2(item)}>
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
                <div class="flex-none w-40 text-xs text-gray-300/60">${format(item.createdAt)}</div>
                <div class="flex-none w-20 text-right text-sm">
                  <p class="num truncate mt-2">${item.fansNumber}</p>
                </div>
                <div class="flex-none w-24 text-right text-sm">
                  <p class="num truncate mt-2">${item.supply}</p>
                </div>
                <div class="flex-none w-24 text-right text-sm">
                  <p class="num truncate mt-2">${item.totalVal}</p>
                </div>
              </div>`
          )}
        `
      )}
    </div>`
  }
}
