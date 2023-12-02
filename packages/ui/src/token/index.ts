import { TailwindElement, html, customElement, classMap, property, state } from '../shared/TailwindElement'

import style from './index.css?inline'
@customElement('ui-token')
export class UIToken extends TailwindElement(style) {
  @property() symbol = 'unknown'

  render() {
    return html`<i class="ui-token"></i>`
  }
}
