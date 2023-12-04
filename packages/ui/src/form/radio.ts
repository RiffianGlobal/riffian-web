import { customElement, TailwindElement, html, property, state, classMap } from '../shared/TailwindElement'
import style from './checkbox.css?inline'

@customElement('ui-radio')
export class UIRadio extends TailwindElement(style) {
  @property() name = ''
  @property() readonly = false
  @property() disabled = false
  @property() checked = false

  @state() model = false

  toggle(e: Event) {
    e.preventDefault()
    if (this.disabled) return
    this.model = !this.model
    this.emit('change', this.model)
  }
  connectedCallback(): void {
    super.connectedCallback()
    console.log(this.disabled)
    this.model = this.checked
  }

  override render() {
    return html`<label
      @click=${this.toggle}
      class="inline-flex items-center gap-1 cursor-pointer select-none leading-none ${classMap({
        checked: this.model
      })}"
      ><i class="radio"></i><slot></slot
    ></label>`
  }
}
