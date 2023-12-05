import { customElement, TailwindElement, html, when, state } from '../shared/TailwindElement'
// Component
import '../dialog/prompt'
import '../button'

@customElement('ui-tip')
export class UITip extends TailwindElement('') {
  @state() model = false

  show() {
    this.model = true
  }
  onClose() {
    this.model = false
  }

  override render() {
    return html`<ui-button @click=${this.show} icon
        ><i class="mdi mdi-help-circle-outline cursor-pointer"></i></ui-button
      >${when(
        this.model,
        () =>
          html`<ui-prompt @close=${this.onClose}>
            <slot></slot>
          </ui-prompt>`
      )}`
  }
}
