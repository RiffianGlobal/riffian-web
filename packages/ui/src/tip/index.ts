import { customElement, ThemeElement, html, when, state } from '../shared/theme-element'
// Component
import '../dialog/prompt'
import '../button'

@customElement('ui-tip')
export class UITip extends ThemeElement('') {
  @state() model = false

  show() {
    this.model = true
  }
  onClose() {
    this.model = false
    this.emit('close')
  }

  override render() {
    return html`<slot name="button" @click=${this.show}
        ><ui-button icon
          ><slot name="icon"><i class="mdi mdi-help-circle-outline cursor-pointer"></i></slot></ui-button></slot
      >${when(
        this.model,
        () =>
          html`<ui-prompt @close=${this.onClose}>
            <slot></slot>
          </ui-prompt>`
      )}`
  }
}
