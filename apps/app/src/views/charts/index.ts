import { ThemeElement, html, customElement, property, keyed } from '@riffian-web/ui/shared/theme-element'
import { chartsStore, StateController } from '~/store/charts'
// Components
import '~/components/top/list'
import '~/components/top/charts-cate'

// Style
import style from './index.css?inline'

@customElement('view-charts')
export class ViewCharts extends ThemeElement(style) {
  bindCharts: any = new StateController(this, chartsStore)

  @property() cate = 'top'

  render() {
    return html`
      <div class="ui-pageview ui-container place-content-center relative flex flex-col">
        <div class="ui-board">
          <div class="ui-board-header">
            <div class="ui-board-lead">
              <h5>
                <charts-cate route></charts-cate>
              </h5>
            </div>
          </div>
          ${keyed(
            chartsStore.cate,
            html`<top-charts paging pageSize="15" .brief=${false} class="w-full"></top-charts>`
          )}
        </div>
      </div>
    `
  }
}
