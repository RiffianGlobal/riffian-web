import { customElement, ThemeElement, html, state, repeat } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/form/checkbox'
import '@riffian-web/ui/form/radio'
import '@riffian-web/ui/form/select'

@customElement('doc-form')
export class DocForm extends ThemeElement('') {
  @state() checked = true
  @state() options = ['A', 'B', 'C', 'D']
  @state() selected = this.options[0]

  get titledOptions() {
    return this.options.map((option, i) => ({ title: `Option ${i + 1}`, value: option }))
  }
  get titledSelected() {
    return this.titledOptions.find((option) => option.value === this.selected)
  }

  onChange = (e: CustomEvent) => (this.checked = e.detail)
  onSelect = (e: CustomEvent) => (this.selected = e.detail.value ?? e.detail)

  override render() {
    return html`
      <!-- Checkbox -->
      <p class="flex w-full gap-4">
        Checkbox:
        <ui-checkbox .checked=${this.checked} @change="${this.onChange}">Checked: ${this.checked}</ui-checkbox>
        <ui-checkbox disabled checked>Disabled</ui-checkbox>
      </p>
      <!-- Radio -->
      <p class="mt-4 flex w-full items-center gap-4">
        Radio:
        ${repeat(
          this.options,
          (option, i) =>
            html`<ui-radio .value=${option} name="radio" .checked=${option == this.selected} @change="${this.onSelect}"
              >Option ${i + 1}</ui-radio
            >`
        )}
      </p>
      <!-- Select -->
      <p class="mt-2 flex w-full items-center gap-2">
        Select:
        <ui-select .value=${this.selected} .options=${this.options} @change=${this.onSelect}
          ><span slot="button">${this.selected}</span></ui-select
        >
        <ui-select .value=${this.selected} .options=${this.titledOptions} @change=${this.onSelect}
          ><span slot="button">${this.titledSelected?.title}</span></ui-select
        >
      </p>
    `
  }
}
