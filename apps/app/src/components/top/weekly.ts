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
import { screenStore } from '@lit-web3/base/screen'
import { weeklyStore } from '~/store/weekly'
import { chartsStore, StateController } from '~/store/charts'
import { weeklySubjectsReq } from '~/query'
import { paginationDef } from '~/utils'
// Components
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/pagination'
import './subject-brief'

import style from './list.css?inline'
@customElement('weekly-top')
export class WeeklyTop extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
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

  get isMobi() {
    return screenStore.isMobi
  }
  get scrollMode() {
    return this.isMobi ? 'click' : 'scroll'
  }
  get page1Len() {
    return chartsStore.weeklySubjects.length
  }
  get loading() {
    return chartsStore.pending && !this.page1Len
  }
  get empty() {
    return chartsStore.inited && !this.page1Len
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

  render() {
    return html`<div role="list" class="ui-list gap-2 ${classMap(this.$c([this.morePending ? 'loading' : 'hover']))}">
        <!-- thead -->
        <div class="flex header border-bottom">
          ${when(!this.isMobi, () => html`<div class="w-8">Rank</div>`)}
          <div class="subject-intro">Collection</div>
          <div class="num pl-2">Volume</div>
        </div>
        <!-- tbody -->
        ${when(
          this.loading,
          () => html`<div name="loading" class="doc-intro"></div><loading-skeleton num="4"></loading-skeleton></div>`,
          () =>
            html`${repeat(
              this.subjects,
              (item: any, i) => html`
                <subject-brief .subject=${item} lite>
                  ${when(!this.isMobi, () => html`<div slot="left" class="subject-rank">${i + 1}</div>`)}
                </subject-brief>
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
