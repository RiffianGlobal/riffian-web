import { ThemeElement, html, customElement, property, repeat, classMap } from '@riffian-web/ui/shared/theme-element'
import { Charts, chartsStore, StateController } from '~/store/charts'

import style from './cate.css?inline'

@customElement('charts-cate')
export class ChartsCate extends ThemeElement(style) {
  bindChart: any = new StateController(this, chartsStore)

  @property({ type: String }) cate = 'top'
  @property({ type: Boolean }) route = false

  goto = (e: CustomEvent, cate: string) => {
    if (this.route) return
    e.stopImmediatePropagation()
    e.preventDefault()
    chartsStore.cate = cate
  }

  render() {
    return html`
      ${repeat(
        Charts,
        (chart) =>
          html`<ui-link
            href="/charts/${chart.key}"
            @click=${(e: CustomEvent) => this.goto(e, chart.key)}
            nav
            dense
            exact
            class="${classMap({ 'exact-active': chartsStore.cate === chart.key })}"
            >${chart.title}</ui-link
          >`
      )}
    `
  }
}
