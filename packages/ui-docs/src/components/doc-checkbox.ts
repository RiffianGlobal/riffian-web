import { customElement, TailwindElement, html, when, state, repeat } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/form/checkbox'
import '@riffian-web/ui/src/form/radio'
import '@riffian-web/ui/src/form/select'

@customElement('doc-checkbox')
export class DocCheckbox extends TailwindElement('') {
  @state() checked = true
  @state() options = ['A', 'B', 'C', 'D']
  @state() selected = this.options[2]
  onChange = (e: CustomEvent) => (this.checked = e.detail)
  onSelect = (e: CustomEvent) => (this.selected = e.detail)
  override render() {
    return html`
      <!-- Checkbox -->
      <p class="flex w-full gap-8">
        <ui-checkbox .checked=${this.checked} @change="${this.onChange}">Checked: ${this.checked}</ui-checkbox>
        <ui-checkbox disabled checked>Disabled</ui-checkbox>
      </p>
      <!-- Radio -->
      <p class="mt-2 flex w-full items-center gap-2">
        ${repeat(
          this.options,
          (option, i) =>
            html`<ui-radio .value=${option} name="radio" .checked=${option == this.selected} @change="${this.onSelect}"
              >Option ${i + 1}</ui-radio
            >`
        )}
        <span class="inline-flex items-center ml-4">Selected: <b>${this.selected}</b></span>
      </p>
      <!-- Select -->
      <p class="mt-2 flex w-full items-center gap-2 hidden">
        ${repeat(
          this.options,
          (option, i) =>
            html`<ui-option .value=${option} name="option" .checked=${option == this.selected} @change="${
              this.onSelect
            }"
              >Option ${i + 1}</ui-radio
            >`
        )}
        <span class="inline-flex items-center ml-4">Selected: <b>${this.selected}</b></span>
      </p>
    `
  }
}
