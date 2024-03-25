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
import { subjectsReq } from '~/query'
import { screenStore } from '@lit-web3/base/screen'
import { chartsStore, StateController } from '~/store/charts'
import { paginationDef } from '~/utils'
// Components
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/pagination'
import './subject-brief'

import style from './list.css?inline'

@customElement('top-charts')
export class TopCharts extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
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

  get isMobi() {
    return screenStore.isMobi
  }
  get scrollMode() {
    return 'scroll'
  }
  get page1Len() {
    return chartsStore.subjects.length
  }
  get empty() {
    return chartsStore.inited && !this.page1Len
  }
  get loading() {
    return chartsStore.chartPending && !this.page1Len
  }
  get subjects() {
    if (this.empty) return []
    return chartsStore.subjects.concat(this.moreSubjects)
  }
  get showRank() {
    return !this.isMobi && chartsStore.cate !== 'new'
  }

  fetch = async (force = false) => {
    if (this.morePending && !force) return
    if (this.paging && !this.hasMore) return
    this.err = ''
    this.morePending = true
    try {
      const req: graphParams = { cate: chartsStore.cate }
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

  render() {
    const showAll = !this.isMobi && !this.brief
    return html`<div role="list" class="ui-list gap-2 ${classMap(this.$c([this.morePending ? 'loading' : 'hover']))}">
      <!-- thead -->
      <div class="flex header border-bottom">
        ${when(this.showRank, () => html`<div class="${classMap(this.$c([this.brief ? 'w-8' : 'w-12']))}">Rank</div>`)}
        <div class="subject-intro">Collection</div>
        ${when(showAll, () => html`<div class="num date">Uploaded</div>`)}
        ${when(showAll, () => html`<div class="num">Price</div>`)}
        <div class="num">Volume</div>
        ${when(showAll, () => html` <div class="num per">24H</div>`)}
      </div>
      <!-- tbody -->
      ${when(
        this.loading,
        () => html`<div name="loading" class="doc-intro"></div><loading-skeleton num="4"></loading-skeleton></div>`,
        () =>
          html` ${repeat(
              this.subjects,
              (item: any, i) =>
                html`<subject-brief .subject=${item} ?lite=${this.brief}>
                  ${when(
                    this.showRank,
                    () =>
                      html`<div slot="left" class="subject-rank ${classMap({ hot: !this.brief })}">
                        ${i + 1}
                        ${when(
                          !this.brief && this.page1Len > 3 && i < 3,
                          () => html`<i class="mdi mdi-fire text-red-400"></i>`
                        )}
                      </div>`
                  )}</subject-brief
                >`
            )}
            <!-- Pagination -->
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
              `,
              () => html`<ui-link dense class="w-full justify-center" href="/charts">More</ui-link>`
            )}`
      )}
    </div>`
  }
}
