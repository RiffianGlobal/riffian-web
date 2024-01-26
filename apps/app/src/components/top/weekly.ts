import {
  ThemeElement,
  html,
  customElement,
  property,
  state,
  repeat,
  when,
  classMap
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { screenStore } from '@lit-web3/base/screen'
import { weeklyStore } from '~/store/weekly'
import { weekList } from './action'
import { goto } from '@lit-web3/router'

import { formatUnits } from 'ethers'
import { emptyCover, paginationDef } from '~/utils'

// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/button'
import '@riffian-web/ui/pagination'

import emitter from '@lit-web3/base/emitter'

import style from './list.css?inline'
@customElement('weekly-top')
export class WeeklyTop extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  bindBridge: any = new StateController(this, bridgeStore)
  bindWeekly: any = new StateController(this, weeklyStore)

  @property({ type: Boolean }) paging = false
  @property({ type: Boolean }) brief = true
  @property({ type: Number }) week = 1
  @state() collections: any = []
  @state() pending = false
  @state() err = ''
  @state() ts = 0
  @state() pagination = paginationDef()
  @state() hasMore = true

  get disabled() {
    return !bridgeStore.bridge.account
  }
  get isMobi() {
    return screenStore.isMobi
  }
  get scrollMode() {
    return this.isMobi ? 'click' : 'scroll'
  }
  get loading() {
    return this.pending && !this.collections?.length
  }
  get empty() {
    return this.ts && !this.collections?.length
  }

  fetch = async (force = false) => {
    if (this.pending && !force) return
    if (this.paging && !this.hasMore) return
    this.err = ''
    this.pending = true

    try {
      const time = await weeklyStore.getLatest()
      const opts = {}
      if (this.pagination) {
        const { pageSize, pageNum } = this.pagination
        Object.assign(opts, { first: pageSize, skip: (pageNum - 1) * pageSize })
      }
      const { subjectWeeklyVotes: collections } = await weekList(time, opts)
      const _collections = collections.map((item: any) => {
        const { subject, volumeTotal, image } = item
        return {
          ...subject,
          volumeTotal,
          image: subject.image?.startsWith(`http`) ? subject.image : emptyCover
        }
      })
      if (this.paging) {
        this.collections.push(..._collections)
        this.hasMore = collections.length >= this.pagination.pageSize
        this.pagination.pageNum++
      } else {
        this.collections = [..._collections]
      }
    } catch (e: any) {
      let msg = e.message || e.code || e
      this.err = e.message || e.msg || e
      console.error(msg)
    } finally {
      this.pending = false
      this.ts++
    }
  }

  loadmore = () => {
    this.fetch()
  }

  go2 = (e: CustomEvent, item: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      const tag = e.target?.tagName
      if (tag == 'I') {
        window.open(item.uri, '_blank')
      } else {
        goto(`/track/${item.id}`)
      }
    }
  }

  static dayChange(item: any) {
    if (item.voteLogs.length == 0) {
      return 'New'
    } else {
      let before = item.voteLogs[0].supply,
        end = item.supply,
        diff = Math.abs(before - end),
        change = ((diff * 100.0) / before).toFixed(1)
      if (before > end) return html`<p class="text-red-500 ">-${change}%</p>`
      else return html`<p class="text-green-500 ">+${change}%</p>`
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.fetch(true)
  }

  render() {
    return html`<div role="list" class="ui-list gap-2 ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
        <div class="flex header border-bottom">
          <div class="w-8 md_w-10">Rank</div>
          <div class="flex-shrink">Collection</div>
          <div class="flex-auto"></div>
          <div class="num flex-auto w-32">Volume</div>
        </div>
        ${when(
          this.loading,
          () => html`<div name="loading" class="doc-intro"></div><loading-skeleton num="4"></loading-skeleton></div>`,
          () =>
            html`${repeat(
              this.collections,
              (item: any, i) => html`
                <div class="item flex items-center" @click=${(e: CustomEvent) => this.go2(e, item)}>
                  <div class="flex-none w-8 md_pl-3 text-sm font-light opacity-70">${i + 1}</div>
                  <div class="flex-shrink flex justify-center">
                    <img-loader
                      .src=${item.image}
                      class="w-[3rem] h-[3rem] md_w-[3.75rem] md_h-[3.75rem] rounded-lg cursor-pointer"
                    ></img-loader>
                  </div>
                  <div class="flex-auto flex-col">
                    <div class="inline-flex">
                      <p class="name truncate cursor-pointer ${this.brief ? 'lg_max-w-64' : ''}">${item.name}</p>
                      <a href=${item.uri} class="flex-none ml-2" target="_blank">
                        <span class="icon mt-1"><i class="mdi mdi-play-circle  opacity-85 hover_opacity-100"></i></span>
                      </a>
                    </div>
                    ${when(
                      this.brief,
                      () =>
                        html`<div class="text-xs text-gray-400/70">
                          <span class="mr-1.5">Price:</span>${(Number(item.supply) + 1) / 10}
                        </div>`
                    )}
                  </div>
                  <div class="num flex-initial flex flex-col !w-18 text-sm items-end">
                    <span>${formatUnits(item.volumeTotal)}</span>
                    <span class="text-xs" style="color: #34C77B">${WeeklyTop.dayChange(item)}</span>
                  </div>
                </div>
              `
            )}`
        )}
      </div>
      <!-- Empty -->
      ${when(this.empty, () => html`<p class="p-2 opacity-60">No votes yet.</p>`)}
      <!-- Pagination -->
      ${when(
        this.paging,
        () =>
          html`<ui-pagination
            .nomore=${this.err}
            mode=${this.scrollMode}
            .firstLoad=${false}
            .pending=${this.pending}
            @loadmore=${this.loadmore}
          ></ui-pagination>`
      )}`
  }
}
