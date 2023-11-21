import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'
import { goto } from '@riffian-web/ui/src/shared/router'
// Components
import '@riffian-web/ui/src/connect-wallet/btn'
import '@riffian-web/ui-docs/src'

// Style
import style from './index.css?inline'
import logo from '~/assets/logo.svg'

@customElement('view-docs')
export class ViewDocs extends TailwindElement(style) {
  render() {
    return html`<div class="docs">
      <!-- UI Docs -->
      <div class="ui-container">
        <ui-components></ui-components>
      </div>
    </div>`
  }
}
