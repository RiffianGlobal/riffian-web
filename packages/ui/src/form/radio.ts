import { customElement, ThemeElement, html, property, classMap } from '../shared/theme-element'
import { PropertyValues } from 'lit'
import style from './checkbox.css?inline'

@customElement('ui-radio')
export class UIRadio extends ThemeElement(style) {
  @property() name!: string
  @property() value!: unknown
  @property() checked = false
  @property() readonly = false
  @property() disabled = false

  select(e?: Event) {
    e?.preventDefault()
    const radios = this.parentNode!.querySelectorAll(`[name="${this.name}"]`)
    radios.forEach((radio) => {
      ;(radio as HTMLInputElement).checked = radio === this
    })
    this.emit('change', this.value)
  }

  willUpdate(changedProps: PropertyValues<this>) {
    if (!changedProps.has('checked')) return
  }
  override render() {
    return html`<label
      @click=${this.select}
      class="ui-radio inline-flex items-center gap-1 cursor-pointer select-none leading-none ${classMap({
        checked: this.checked
      })}"
      ><i class="input"></i><slot></slot
    ></label>`
  }
}
