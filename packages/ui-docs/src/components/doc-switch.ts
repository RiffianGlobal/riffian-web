import { customElement, ThemeElement, html, state } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/input/switch'

@customElement('doc-switch')
export class DocSwitch extends ThemeElement('') {
  @state() val = false
  override render() {
    return html`
      <p class="flex gap-1 items-center">
        <ui-input-switch .checked="val" @change="${(e: CustomEvent) => (this.val = e.detail)}"></ui-input-switch>
        ${this.val}
      </p>
    `
  }
}
