import { customElement, ThemeElement, html, property } from '../shared/theme-element'
// Components
import './index'

import style from './icon.css?inline'
@customElement('ui-copy-icon')
export class UICopyIcon extends ThemeElement(style) {
  @property({ type: String }) value = ''

  override render() {
    return html`<ui-copy .value=${this.value} sm icon
      ><span slot="copied" class="text-green-500">
        <i class="mdi mdi-check-circle-outline"></i>
      </span>
      <span slot="copy"><i class="mdi mdi-content-copy"></i></span
    ></ui-copy>`
  }
}
