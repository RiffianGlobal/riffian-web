import { screenStore } from '@lit-web3/base'
import { customElement, ThemeElement, html, when, state } from '../../shared/theme-element'

import style from './index.css?inline'


@customElement('ui-tip-rookie')
export class UITipRookie extends ThemeElement('') {

  @state() show = true

  render() {
    return html `
      ${when(
        screenStore.isMobi,
        () => html`
          <div>
            <p>mobile rookie tips</p>
          </div>
        `,
        () => html`
          <div>
            <p>pc rookie tips</p>
          </div>
        `
      )}
    `
  }
}
