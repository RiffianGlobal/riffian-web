import { ThemeElement, html, customElement, classMap, property, state } from '../shared/theme-element'

import style from './index.css?inline'
@customElement('ui-token')
export class UIToken extends ThemeElement(style) {
  @property() symbol = 'unknown'

  render() {
    return html`<i class="ui-token"></i>`
  }
}
