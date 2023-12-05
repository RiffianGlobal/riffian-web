import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/form/checkbox'
import '@riffian-web/ui/src/form/radio'

@customElement('doc-checkbox')
export class DocCheckbox extends TailwindElement('') {
  @state() checked = true
  @state() radio = false
  onChange = (e: CustomEvent) => (this.checked = e.detail)
  override render() {
    return html`
      <p class="flex w-full gap-8">
        <ui-checkbox .checked=${this.checked} @change="${this.onChange}">Checked: ${this.checked}</ui-checkbox>
        <ui-checkbox disabled checked>Disabled</ui-checkbox>
      </p>
      <p class="flex w-full gap-8 hidden">
        <ui-radio .checked=${this.radio} @change="${this.onChange}">Option 1</ui-radio>
      </p>
    `
  }
}
