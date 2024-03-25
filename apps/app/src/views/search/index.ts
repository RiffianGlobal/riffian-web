import { ThemeElement, html, customElement, property, keyed, state } from '@riffian-web/ui/shared/theme-element'
import { screenStore, StateController } from '@lit-web3/base/screen'
// Components
import '~/components/top/list'
import '~/components/top/charts-cate'

// Style
import style from './index.css?inline'

@customElement('view-search')
export class ViewSearch extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)

  @property({ type: String }) keyword = ''

  @state() morePending = false

  get isMobi() {
    return screenStore.isMobi
  }

  render() {
    return html`
      <div class="ui-pageview ui-container place-content-center relative flex flex-col">
        <div class="ui-board">
          <div class="ui-board-header">
            <div class="ui-board-lead">
              <div class="ui-board-title">
                <h5>Search results for <span class="inline-block font-bold">${this.keyword}</span></h5>
              </div>
            </div>
          </div>

          ${keyed(this.keyword, html`<object-search-list .keyword=${this.keyword}></object-search-list>`)}
        </div>
      </div>
    `
  }
}
