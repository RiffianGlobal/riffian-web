import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/connect-wallet/btn'
import '@riffian-web/ui-docs/src'

// Style
@customElement('view-docs')
export class ViewDocs extends TailwindElement('') {
  render() {
    return html`<div class="ui-container"><ui-docs></ui-docs></div>`
  }
}
