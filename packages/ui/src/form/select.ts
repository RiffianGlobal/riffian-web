import { customElement, ThemeElement, html, repeat, state, classMap, property } from '../shared/theme-element'
// Components
import '../menu/drop'

type Option = any | Record<string, any>

@customElement('ui-select')
export class UISelect extends ThemeElement('') {
  @property() options: Option[] = []
  @property() value: Option | undefined

  @state() menu = false

  get isObject() {
    return typeof this.options[0] === 'object'
  }

  select = (e: Event, option: Option) => {
    e?.preventDefault()
    if (option.value !== this.value) {
      this.emit('change', this.isObject ? option : option.value)
    }
    this.menu = false
  }

  get titledOptions() {
    return this.options.map((option) => {
      const { title = option, value = option } = option
      return { title, value }
    })
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
        <slot slot="button" name="button">Select</slot>
        <!-- Content -->
        <ul class="ui-option">
          ${repeat(
            this.titledOptions,
            (option) =>
              html`<li
                @click="${(e: Event) => this.select(e, option)}"
                class="${classMap({ active: option.value === this.value })}"
              >
                ${option.title}
              </li>`
          )}
        </ul>
      </ui-drop>
    `
  }
}
