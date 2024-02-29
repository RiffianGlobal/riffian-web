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
import { subjectsReq } from '~/query'
import { screenStore } from '@lit-web3/base/screen'
import { weeklyStore } from '~/store/weekly'
import { chartsStore } from '~/store/charts'
import { goto } from '@lit-web3/router'
import { format } from '~/lib/dayjs'
import emitter from '@lit-web3/base/emitter'
import { paginationDef } from '~/utils'
// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/pagination'
import '~/components/chg-stat'

import style from './list.css?inline'
@customElement('top-album')
export class TopAlbum extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  bindBridge: any = new StateController(this, bridgeStore)
  bindWeekly: any = new StateController(this, weeklyStore)
  bindCharts: any = new StateController(this, chartsStore)

  @property({ type: Boolean }) paging = false
  @property({ type: Boolean }) brief = true
  @property({ type: Number }) pageSize = 10

  @state() moreSubjects: any = []
  @state() morePending = false
  @state() ts = 0
  @state() err = ''
  @state() pagination = paginationDef({ pageNum: 2, pageSize: this.pageSize })
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
    return chartsStore.inited && !chartsStore.subjects.length
  }
  get loading() {
    return chartsStore.pending && !chartsStore.subjects.length
  }
  get subjects() {
    return chartsStore.subjects.concat(this.moreSubjects)
  }

  fetch = async (force = false) => {
    if (this.morePending && !force) return
    if (this.paging && !this.hasMore) return
    this.err = ''
    this.morePending = true
    try {
      const req: graphParams = {}
      if (this.pagination) {
        const { pageSize, pageNum } = this.pagination
        Object.assign(req, { first: pageSize, skip: (pageNum - 1) * pageSize })
      }
      const { subjects } = await subjectsReq(req)
      if (this.paging) {
        this.moreSubjects = [...this.moreSubjects, ...subjects]
        this.hasMore = subjects.length >= this.pagination.pageSize
        this.pagination.pageNum++
      } else {
        this.moreSubjects = [...subjects]
      }
    } catch (e: any) {
      this.err = e.message || e.msg || e
    } finally {
      this.morePending = false
      this.ts++
    }
  }

  loadmore = () => {
    this.fetch()
  }

  fullItemMobi = (item: any) => {
    return html`<div class="w-full overflow-hidden flex gap-x-2" @click=${(e: CustomEvent) => this.go2(e, item)}>
      <div class="w-[3.25rem] h-[3.25rem] mr-2 rounded-lg">
        <img-loader src=${item.image} class="w-[3.25rem] rounded-lg"></img-loader>
      </div>
      <div class="subject-lines flex-auto overflow-hidden">
        <div class="subject-line1">
          <p class="subject-name ${classMap({ limit: this.brief })}">${item.name}</p>
          <a href=${item.uri} class="flex-none ml-1.5" target="_blank">
            <i class="subject-play mdi mdi-play-circle-outline"></i>
          </a>
        </div>
        <div class="text-xs text-gray-400/80">
          <span class="mr-1 text-gray-400/60">Price:</span>${item.cooked.price}
        </div>
      </div>
      <div class="subject-lines num flex-initial !w-12 text-sm items-end">
        <span class="subject-line1">${item.cooked.total}</span>
        <span class="text-xs"><chg-stat .chg=${item.cooked.chg}></chg-stat></span>
      </div>
    </div>`
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
      ? html` ${when(!this.isMobi, () => html`<div class="w-8">Rank</div>`)}
          <div class="flex-shrink">Collection</div>
          <div class="flex-auto"></div>
          <div class="num flex-auto w-32">Volume</div>`
      : html`
          ${when(!this.isMobi, () => html`<div class="w-16">Index</div>`)}
          <div class="flex-auto">Name</div>
          ${when(!this.isMobi, () => html`<div class="flex-none w-40">Created</div>`)}
          <div class="num flex-none w-24">Volume</div>
          ${when(
            !this.isMobi,
            () =>
              html`<div class="num flex-none w-24">Price</div>
                <div class="num flex-none w-24">24H</div>`
          )}
        `
  }

  itemEle = (item: any, i: number) => {
    return this.brief
      ? html`<div class="item flex items-center" @click=${(e: CustomEvent) => this.go2(e, item)}>
          ${when(
            !this.isMobi,
            () => html`<div class="flex-none w-8 text-center text-sm font-light opacity-70">${i + 1}</div>`
          )}

          <div class="subject-img flex-shrink flex justify-center">
            <img-loader .src=${item.cooked.src} class="w-14 rounded-lg"></img-loader>
          </div>
          <div class="subject-lines flex-auto overflow-hidden">
            <div class="subject-line1">
              <p class="subject-name ${classMap({ limit: this.brief })}">${item.name}</p>
              <a href=${item.uri} class="flex-none ml-1.5" target="_blank">
                <i class="subject-play mdi mdi-play-circle-outline"></i>
              </a>
            </div>
            ${when(
              this.brief,
              () =>
                html`<div class="text-xs text-gray-400/80">
                  <span class="mr-1 text-gray-400/60">Price:</span>${item.cooked.price}
                </div>`
            )}
          </div>
          <div class="subject-lines num flex-initial !w-12 text-sm items-end">
            <span class="subject-line1">${item.cooked.total}</span>
            <span class="text-xs"><chg-stat .chg=${item.cooked.chg}></chg-stat></span>
          </div>
        </div>`
      : html`
          ${when(
            !this.isMobi,
            () => html`
              <div class="item flex items-center hover_cursor-pointer" @click=${(e: CustomEvent) => this.go2(e, item)}>
                <div class="flex-none w-16 pl-4 text-sm font-light opacity-75">
                  ${i + 1}
                  ${when(this.subjects.length > 3 && i < 3, () => html`<i class="mdi mdi-fire text-red-400"></i>`)}
                </div>
                <div class="flex-auto flex overflow-hidden">
                  <div class="w-[3.25rem] h-[3.25rem] mr-4 rounded-lg">
                    <img-loader src=${item.cooked.src} class="w-[3.25rem] h-[3.25rem] rounded-lg"></img-loader>
                  </div>
                  <div class="truncate ">
                    <p class="subject-name subject-line1 lg_text-base truncate w-full">${item.name}</p>
                    <i class="subject-play mdi mdi-play-circle"></i>
                  </div>
                </div>
                <div class="flex-none w-40 text-xs text-gray-300/60">${format(item.createdAt)}</div>
                <div class="flex-none w-24 text-right text-sm"><span>${item.cooked.total}</span></div>
                <div class="flex-none w-24 text-right text-sm">
                  <span>${item.cooked.price}</span>
                </div>
                <div class="flex-none w-24 text-right text-sm leading-none">
                  <span><chg-stat .chg=${item.cooked.chg}></chg-stat></span>
                </div>
              </div>
            `,
            () => html`${this.fullItemMobi(item)}`
          )}
        `
  }

  render() {
    return html`<div role="list" class="ui-list gap-2 ${classMap(this.$c([this.morePending ? 'loading' : 'hover']))}">
      <div class="flex header border-bottom">${this.headerEle()}</div>
      ${when(
        this.loading,
        () => html`<div name="loading" class="doc-intro"></div><loading-skeleton num="4"></loading-skeleton></div>`,
        () =>
          html`${repeat(this.subjects, (item: any, i) => html`${this.itemEle(item, i)}`)}
          ${when(
            this.paging,
            () => html`
              <ui-pagination
                .nomore=${this.err}
                mode=${this.scrollMode}
                .firstLoad=${false}
                .pending=${this.morePending}
                @loadmore=${this.loadmore}
              ></ui-pagination>
            `
          )} `
      )}
    </div>`
  }
}
