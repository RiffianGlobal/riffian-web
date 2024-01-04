import { customElement, ThemeElement, html, state } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/menu/drop'

@customElement('doc-menu')
export class DocMenu extends ThemeElement('') {
  @state() menu = false
  closeMenu = () => {
    this.menu = false
  }
  override render() {
    return html`
      <ui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        btnText
        icon
        align="left"
        dropClass="w-72"
      >
        <span slot="button">Settings</span>
        <!-- Content -->
        <ul class="ui-option">
          <li @click="${this.closeMenu}">Option A</li>
          <li @click="${this.closeMenu}">Option B</li>
        </ul>
      </ui-drop>
    `
  }
}
