import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/menu/drop'

@customElement('doc-menu')
export class DocMenu extends TailwindElement('') {
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
