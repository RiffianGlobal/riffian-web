import { customElement, ThemeElement, html, Ref, ref, createRef } from '../shared/theme-element'
// Component
import './index'
import '../button'

import { UIDialog } from './index'
import style from './confirm.css?inline'
@customElement('ui-confirm')
// @ts-ignore
export class UIConfirm extends ThemeElement([UIDialog.styles, style]) {
  el$: Ref<UIDialog> = createRef()
  onClose() {
    this.emit('close')
  }
  close() {
    this.el$.value?.close()
  }
  confirm() {
    this.emit('confirm')
  }

  override render() {
    return html`<ui-dialog ${ref(this.el$)} @close=${this.onClose}>
      <slot slot="header" name="header" class="font-bold"></slot>
      <slot></slot>
      <div slot="footer" class="w-full flex justify-end gap-4">
        <ui-button text @click=${this.close}>Dismiss</ui-button>
        <ui-button text @click=${this.confirm}>Accept</ui-button>
      </div>
    </ui-dialog>`
  }
}
