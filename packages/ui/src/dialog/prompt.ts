import { customElement, ThemeElement, html, when, ref, createRef, property, Ref } from '../shared/theme-element'
// Component
import './index'
import '../button'

import { UIDialog } from './index'
import style from './prompt.css?inline'
@customElement('ui-prompt')
// @ts-ignore
export class UIPrompt extends ThemeElement([UIDialog.styles, style]) {
  @property({ type: Boolean }) button = false
  el$: Ref<UIDialog> = createRef()
  onClose() {
    this.emit('close')
  }
  refClose() {
    this.el$.value?.close()
  }

  override render() {
    return html`<ui-dialog ${ref(this.el$)} @close=${this.onClose}>
      <slot slot="header" name="header" class="font-bold"></slot>
      <slot></slot>
      ${when(
        this.button,
        () =>
          html`<div slot="footer" class="w-full flex justify-between gap-4">
            <div></div>
            <div>
              <ui-button text @click=${this.refClose}>Close</ui-button>
            </div>
          </div>`
      )}
    </ui-dialog>`
  }
}
