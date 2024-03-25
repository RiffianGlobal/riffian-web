import {
  ThemeElement,
  customElement,
  html,
  property,
  state,
  ref,
  createRef,
  repeat,
  when
} from '@riffian-web/ui/shared/theme-element'
import { goto } from '@lit-web3/router'
import { chartsStore, StateController } from '~/store/charts'
import { screenStore } from '@lit-web3/base/screen'
import { paginationDef } from '~/utils'
// Components
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/menu/drop'
import '~/components/top/subject-brief'
import '@riffian-web/ui/pagination'

import style from './list.css?inline'

const liteSize = 6

@customElement('object-search-list')
export class ObjectSearchList extends ThemeElement(style) {
  input$: any = createRef()
  bindCharts: any = new StateController(this, chartsStore)
  bindScreen: any = new StateController(this, screenStore)

  @property({ type: String }) keyword = ''
  @property({ type: Boolean }) lite = false
  @property({ type: Boolean }) sm = false

  @state() menu = false
  @state() inited = false
  @state() subjects = []
  // Pagination
  @state() err = ''
  @state() morePending = false
  @property({ type: Number }) pageSize = 10
  @state() pagination = paginationDef({ pageNum: 1, pageSize: this.pageSize })
  @state() hasMore = true

  get len() {
    return this.subjects.length
  }
  get loading() {
    return !this.inited
  }
  get empty() {
    return this.inited && !this.len
  }
  get isMobi() {
    return screenStore.isMobi
  }
  get results() {
    return this.lite ? this.subjects.slice(0, liteSize - 1) : this.subjects
  }
  fetch = async () => {
    const reqKeyword = this.keyword
    if (!reqKeyword) {
      if (this.len) this.subjects = []
      return
    }
    this.err = ''
    try {
      const req: any[] = [reqKeyword, liteSize, 0]
      if (!this.lite) {
        const { pageSize, pageNum } = this.pagination
        Object.assign(req, { first: pageSize, skip: (pageNum - 1) * pageSize })
        req[1] = pageSize
        req[2] = (pageNum - 1) * pageSize
      }
      const subjects = await chartsStore.search(...req)
      // TODO: abort req
      if (reqKeyword === this.keyword) this.subjects = this.subjects.concat(subjects)
      this.hasMore = subjects.length >= this.pagination.pageSize
      if (this.hasMore) this.pagination.pageNum++
    } catch {
      this.hasMore = false
    }
    this.inited = true
  }
  loadmore = async () => {
    if (this.morePending || !this.hasMore) return
    this.morePending = true
    await this.fetch()
    this.morePending = false
  }

  goSearch = () => {
    goto(`/search/${this.keyword}`)
  }

  connectedCallback() {
    super.connectedCallback()
    this.fetch()
  }

  render() {
    const showAll = !this.isMobi
    if (this.empty) return html`<i class="block p-3">No result yet.</i>`
    if (this.loading) return html`<p class="flex w-full pt-4 justify-center"><i class="mdi mdi-loading"></i></p>`
    return html`<ul class="ui-list gap-2 hover">
        <!-- thead -->
        ${when(
          !this.lite,
          () =>
            html`<div class="flex header border-bottom">
              <div class="subject-intro">Collection</div>
              ${when(showAll, () => html`<div class="num date">Uploaded</div>`)}
              ${when(showAll, () => html`<div class="num">Price</div>`)}
              <div class="num">Volume</div>
              ${when(showAll, () => html` <div class="num per">24H</div>`)}
            </div>`
        )}
        <!-- tbody -->
        ${repeat(
          this.results,
          (subject) => html`<subject-brief .subject=${subject} ?lite=${this.lite} ?sm=${this.sm}></subject-brief>`
        )}
        <!-- Goto search -->
        ${when(
          this.lite && this.len >= liteSize,
          () =>
            html`<li @click=${this.goSearch} class="justify-center p-1 pb-4">
              <ui-link>View More</ui-link>
            </li>`
        )}
      </ul>
      <!-- Pagination -->
      ${when(
        !this.lite,
        () =>
          html`<ui-pagination
            .nomore=${!this.hasMore}
            mode="scroll"
            .firstLoad=${false}
            .pending=${this.morePending}
            @loadmore=${this.loadmore}
          ></ui-pagination>`
      )}`
  }
}
