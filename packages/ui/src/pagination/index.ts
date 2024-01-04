import { ThemeElement, html, customElement, property, when, classMap } from '../shared/theme-element'
import { LazyElement } from '@lit-web3/base/lazy-element'

// Components
import '../loading/icon'
import '../link'
// Styles
import style from './index.css?inline'
@customElement('ui-pagination')
export class UIPagination extends LazyElement(ThemeElement(style), { persistent: true, rootMargin: '30px' }) {
  @property({ type: Number }) pageSize = 5
  @property({ type: Number }) page = 1
  @property() mode = 'scroll' //scroll or click auto
  @property() pending? = false
  @property({ type: Boolean }) firstLoad = true
  @property({ type: Boolean }) empty = false
  @property({ type: Boolean }) nomore = false // all loaded
  @property() class = ''

  get canLoad() {
    return !this.pending && !this.nomore && !this.empty && !this.firstLoad
  }
  get scrollMode() {
    return this.mode === 'scroll'
  }
  loadmore() {
    if (!this.canLoad) return
    const { pageSize, page, mode } = this
    this.emit('loadmore', { pageSize, page, mode })
  }
  connectedCallback() {
    super.connectedCallback()
  }
  override onObserved = () => {
    if (this.scrollMode) this.loadmore()
  }
  // nomore
  // loading
  render() {
    return html`<div
      class="ui-pagination w-full flex justify-center items-center mt-4 ${classMap(
        this.$c([{ nomore: this.nomore, 'pointer-events-none': !this.canLoad }, this.class])
      )}"
    >
      <div part="inner" @click="${this.loadmore}">
        ${when(
          this.empty,
          () => html`<slot name="empty"></slot>`,
          () =>
            html`${when(
              this.nomore,
              () => html`<slot name="nomore"></slot>`,
              () =>
                html`${when(
                  this.pending,
                  () => html`<slot name="loading"><loading-icon type="block"></loading-icon></slot>`,
                  () =>
                    html`${when(
                      !this.scrollMode && !this.firstLoad,
                      () => html`<slot><ui-link>Load more</ui-link></slot>`
                    )}`
                )}`
            )}`
        )}
      </div>
    </div>`
  }
}
