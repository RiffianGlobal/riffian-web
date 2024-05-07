import { ThemeElement, html, customElement, property, keyed, state, when, classMap } from '@riffian-web/ui/shared/theme-element'
import { chartsStore, StateController } from '~/store/charts'
// Components
import '~/components/top/list'
import '~/components/top/charts-cate'
import '~/components/top/chart-filters'
import { screenStore } from '@lit-web3/base'

// Style
import style from './index.css?inline'

@customElement('view-charts')
export class ViewCharts extends ThemeElement(style) {
  bindCharts: any = new StateController(this, chartsStore)

  @property() cate = 'top'

  @state() showFilter = screenStore.isMobi ? false : true

  close = async () => {
    this.showFilter = false
    console.log('close')
  }

  open = async () => {
    this.showFilter = true
    console.log('open')
  }
  toggle = () => {
    this.showFilter ? this.close() : this.open()
  }

  render() {
    return html`
      <div class="ui-pageview ui-container place-content-center relative flex flex-col">
        <div class="ui-board">
          <div class="ui-board-header">
            <div class="ui-board-lead">
              <div class="ui-board-title">
                <charts-cate route></charts-cate>
              </div>
            </div>
            ${when(
              screenStore.isMobi,
              () => html`
                <button
                  class="inline-flex items-center space-x-0.5 bg-transparent px-4" @click=${this.toggle}>
                  <slot name="icon">
                    <i class="text-lg -mr-0.5 leading-none mdi mdi-chevron-down ${classMap({
                          'mdi-chevron-down': !this.showFilter,
                          'mdi-chevron-up': this.showFilter,
                        })}">
                    </i>
                  </slot>
                </button>
              `
            )}
          </div>
          <div class="box-border p-2" style="${this.showFilter ? '' : 'display: none;'}">
            <chart-filters></chart-filters>
          </div>
          ${keyed(
            chartsStore.cate,
            keyed(
              chartsStore.filterTimeValue,
              keyed(
                chartsStore.filterPriceValue,
                html`<top-charts paging pageSize="15" .brief=${false} class="w-full"></top-charts>`
              )
            )
          )}
        </div>
      </div>
    `
  }
}
