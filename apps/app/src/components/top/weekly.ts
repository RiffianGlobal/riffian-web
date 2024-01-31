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
import { chartsStore } from '~/store/charts'
import { weeklySubjectsReq } from '~/query'
import { goto } from '@lit-web3/router'
import { paginationDef } from '~/utils'
import emitter from '@lit-web3/base/emitter'
// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/button'
import '@riffian-web/ui/pagination'
import '~/components/chg-stat'

import style from './list.css?inline'
@customElement('weekly-top')
export class WeeklyTop extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  bindBridge: any = new StateController(this, bridgeStore)
  bindWeekly: any = new StateController(this, weeklyStore)
  bindCharts: any = new StateController(this, chartsStore)

  @property({ type: Boolean }) paging = false
  @property({ type: Boolean }) brief = true

  @state() moreSubjects: any = []
  @state() morePending = false
  @state() err = ''
  @state() ts = 0
  @state() pagination = paginationDef({ pageNum: 2 })
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
    return chartsStore.pending && !chartsStore.weeklySubjects.length
  }
  get empty() {
    return chartsStore.inited && !chartsStore.weeklySubjects.length
  }
  get subjects() {
    return chartsStore.weeklySubjects.concat(this.moreSubjects)
  }

  fetch = async (force = false) => {
    if (this.morePending && !force) return
    if (this.paging && !this.hasMore) return
    this.err = ''
    this.morePending = true

    try {
      const week = await weeklyStore.getLatest()
      const req: graphParams = { week }
      if (this.pagination) {
        const { pageSize, pageNum } = this.pagination
        Object.assign(req, { first: pageSize, skip: (pageNum - 1) * pageSize })
      }
      const { weeklySubjects } = await weeklySubjectsReq(req)
      if (this.paging) {
        this.moreSubjects = [...this.moreSubjects, ...weeklySubjects]
        this.hasMore = weeklySubjects.length >= this.pagination.pageSize
        this.pagination.pageNum++
      } else {
        this.moreSubjects = [...weeklySubjects]
      }
    } catch (e: any) {
      let msg = e.message || e.code || e
      this.err = e.message || e.msg || e
      console.error(msg)
    } finally {
      this.morePending = false
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

  render() {
    return html`<div role="list" class="ui-list gap-2 ${classMap(this.$c([this.morePending ? 'loading' : 'hover']))}">
        <div class="flex header border-bottom">
          <div class="w-8">Rank</div>
          <div class="flex-shrink">Collection</div>
          <div class="flex-auto"></div>
          <div class="num flex-auto w-32">Volume</div>
        </div>
        ${when(
          this.loading,
          () => html`<div name="loading" class="doc-intro"></div><loading-skeleton num="4"></loading-skeleton></div>`,
          () =>
            html`${repeat(
              this.subjects,
              (item: any, i) => html`
                <div class="item flex items-center" @click=${(e: CustomEvent) => this.go2(e, item)}>
                  <div class="flex-none w-8 text-center text-sm font-light opacity-70">${i + 1}</div>
                  <div class="flex-shrink flex justify-center">
                    <img-loader .src=${item.cooked.src} class="subject-img"></img-loader>
                  </div>
                  <div class="subject-lines flex-auto">
                    <div class="subject-line1">
                      <p class="subject-name ${classMap({ limit: this.brief })}">${item.name}</p>
                      <a href=${item.uri} class="flex-none ml-1.5" target="_blank">
                        <i class="subject-play mdi mdi-play-circle"></i>
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
                  <div class="subject-lines num flex-initial !w-18 text-sm items-end">
                    <span class="subject-line1">${item.cooked.total}</span>
                    <span class="text-xs"><chg-stat .chg=${item.cooked.chg}></chg-stat></span>
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
            .pending=${this.morePending}
            @loadmore=${this.loadmore}
          ></ui-pagination>`
      )}`
  }
}
