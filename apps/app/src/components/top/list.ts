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
import { albumList } from './action'
import { screenStore } from '@lit-web3/base/screen'
import { weeklyStore } from '~/store/weekly'
import { goto } from '@lit-web3/router'
import { format } from '~/lib/dayjs'
// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/pagination'

import emitter from '@lit-web3/base/emitter'
import { emptyCover, paginationDef } from '~/utils'

import style from './list.css?inline'
import { formatUnits } from 'ethers'
@customElement('top-album')
export class TopAlbum extends ThemeElement(style) {
  indScreen: any = new StateController(this, screenStore)
  bindBridge: any = new StateController(this, bridgeStore)
  bindWeekly: any = new StateController(this, weeklyStore)

  @property({ type: Boolean }) paging = false
  @property({ type: Boolean }) brief = true
  @property({ type: Number }) pageSize = 10

  @state() subjectList: any = []
  @state() pending = false
  @state() ts = 0
  @state() err = ''
  @state() pagination = paginationDef({ pageSize: this.pageSize })
  @state() hasMore = true

  get disabled() {
    return !bridgeStore.bridge.account
  }
  get isMobi() {
    return screenStore.isMobi
  }
  get scrollMode() {
    return 'scroll'
  }
  get empty() {
    return this.pending && !this.subjectList.length
  }

  fetch = async (force = false) => {
    if (this.pending && !force) return
    if (this.paging && !this.hasMore) return
    this.err = ''
    this.pending = true
    try {
      const opts = {}
      if (this.pagination) {
        const { pageSize, pageNum } = this.pagination
        Object.assign(opts, { first: pageSize, skip: (pageNum - 1) * pageSize })
      }
      let { subjects } = await albumList(opts)
      const _subjects = subjects.map((item: any) => ({
        ...item,
        totalVal: +formatUnits(item.totalVoteValue).toString(),
        image: item.image?.startsWith(`http`) ? item.image : emptyCover
      }))
      if (this.paging) {
        this.subjectList.push(..._subjects)
        this.hasMore = subjects.length >= this.pagination.pageSize
        this.pagination.pageNum++
      } else {
        this.subjectList = [..._subjects]
      }
    } catch (e: any) {
      this.err = e.message || e.msg || e
    } finally {
      this.pending = false
      this.ts++
    }
  }

  loadmore = () => {
    this.fetch()
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

  headerEle = () => {
    return this.brief
      ? html` <div class="w-8 md_w-10">Rank</div>
          <div class="flex-shrink">Collection</div>
          <div class="flex-auto"></div>
          <div class="num flex-auto w-32">Volume</div>`
      : html`
          <div class="w-16">Index</div>
          <div class="flex-auto">Name</div>
          <div class="flex-none w-40">Created</div>
          <div class="num flex-none w-24">Volume</div>
          <div class="num flex-none w-24">Price</div>
          <div class="num flex-none w-24">24H</div>
        `
  }

  itemEle = (item: any, i: number) => {
    return this.brief
      ? html`<div class="item flex items-center" @click=${(e: CustomEvent) => this.go2(e, item)}>
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
                <span class="icon mt-1"><i class="mdi mdi-play-circle opacity-85 hover_opacity-100"></i></span>
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
          <div class="num flex-initial flex flex-col !w-12 text-sm items-end">
            <span>${item.totalVal}</span>
            <span class="text-xs mt-1.5" style="color: #34C77B">${TopAlbum.dayChange(item)}</span>
          </div>
        </div>`
      : html`
          <div class="item flex items-center hover_cursor-pointer" @click=${(e: CustomEvent) => this.go2(e, item)}>
            <div class="flex-none w-16 pl-4 text-sm font-light opacity-75">
              ${i + 1}
              ${when(this.subjectList.length > 3 && i < 3, () => html`<i class="mdi mdi-fire text-red-400"></i>`)}
            </div>
            <div class="flex-auto flex">
              <div class="w-[3.25rem] h-[3.25rem] mr-4 rounded-lg">
                <img-loader src=${item.image} class="rounded-lg"></img-loader>
              </div>
              <div>
                <p class="name truncate">${item.name}</p>
                <span class="icon mt-1"><i class="mdi mdi-play-circle opacity-85 hover_opacity-100"></i></span>
              </div>
            </div>
            <div class="flex-none w-40 text-xs text-gray-300/60">${format(item.createdAt)}</div>
            <div class="flex-none w-24 text-right text-sm"><span>${item.totalVal}</span></div>
            <div class="flex-none w-24 text-right text-sm">
              <span>${(Number(item.supply) + 1) / 10}</span>
            </div>
            <div class="flex-none w-24 text-right text-sm"><span>${TopAlbum.dayChange(item)}</span></div>
          </div>
        `
  }

  async connectedCallback() {
    super.connectedCallback()
    this.fetch(true)
    emitter.on('manual-change', () => {
      this.pagination = paginationDef()
      this.fetch(true)
    })
  }

  render() {
    return html`<div role="list" class="ui-list gap-2 ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
      <div class="flex header border-bottom">${this.headerEle()}</div>
      ${when(
        this.empty,
        () => html`<div name="loading" class="doc-intro"></div><loading-skeleton num="4"></loading-skeleton></div>`,
        () =>
          html`${repeat(this.subjectList, (item: any, i) => html`${this.itemEle(item, i)}`)}
          ${when(
            this.paging,
            () => html`
              <ui-pagination
                .nomore=${this.err}
                mode=${this.scrollMode}
                .firstLoad=${false}
                .pending=${this.pending}
                @loadmore=${this.loadmore}
              ></ui-pagination>
            `
          )} `
      )}
    </div>`
  }
}
