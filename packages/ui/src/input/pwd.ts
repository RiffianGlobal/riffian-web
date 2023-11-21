import { TailwindElement, customElement, property, state, html, when, classMap } from '../shared/TailwindElement'
import { EditableElement } from './editable'
import './text'
import '../button'

import style from './text.css?inline'

@customElement('ui-input-pwd')
export class UIInputPwd extends EditableElement(TailwindElement(style)) {
  @property({ type: Boolean }) toggle = true
  @state() type = 'password'

  get hide() {
    return this.type === 'password'
  }

  toggleSwitch = (e: Event) => {
    this.type = this.hide ? 'text' : 'password'
  }

  renderDefRight = () => {
    if (!this.toggle) return ``
    return html`<ui-button tabindex="-1" sm icon @click=${this.toggleSwitch}
      ><i class="mdi ${classMap(this.$c([this.hide ? 'mdi-eye-off-outline' : 'mdi-eye']))}"></i
    ></ui-button>`
  }

  render() {
    return html`${this.renderHtml()}`
  }
}
