import { customElement, ThemeElement, html, property, state, classMap } from '../shared/theme-element'
import style from './checkbox.css?inline'

@customElement('ui-checkbox')
export class UICheckbox extends ThemeElement(style) {
  @property() name = ''
  @property() readonly = false
  @property() disabled = false
  @property() checked = false

  @state() model = false

  get isDisabled() {
    return this.disabled || this.readonly
  }

  toggle(e: Event) {
    e.preventDefault()
    if (this.isDisabled) return
    this.model = !this.model
    this.emit('change', this.model)
  }
  connectedCallback(): void {
    super.connectedCallback()
    this.model = this.checked
  }

  override render() {
    return html`<label
      ?disabled=${this.isDisabled}
      @click=${this.toggle}
      class="ui-checkbox inline-flex items-center gap-1 select-none leading-none ${classMap({
        checked: this.model
      })}"
      ><i class="input"></i><slot></slot
    ></label>`
  }
}
