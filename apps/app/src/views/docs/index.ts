import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/connect-wallet/btn'
import '@riffian-web/ui-docs/src'

// Style
@customElement('view-docs')
export class ViewDocs extends ThemeElement('') {
  render() {
    return html`<div class="ui-container"><ui-docs></ui-docs></div>`
  }
}
