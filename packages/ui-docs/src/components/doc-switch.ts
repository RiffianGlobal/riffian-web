import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/input/switch'

@customElement('doc-switch')
export class DocSwitch extends TailwindElement('') {
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
