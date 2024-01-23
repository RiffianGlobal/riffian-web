// Todo: ShadowRoot should be created as childNodes of document.body
import { customElement, ThemeElement, html, state, property, classMap } from '../shared/theme-element'

import style from './dialog.css?inline'

@customElement('ui-dialog')
export class UIDialog extends ThemeElement(style) {
  @property({ type: Boolean }) persistent = false
  @property({ type: String }) wrapperClass = ''
  @state() model = false

  close = async () => {
    this.model = false
    this.unlisten()
    this.emit('close')
    this.remove()
  }

  #onEsc = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    e.preventDefault()
    this.close()
  }
  listen() {
    this.unlisten()
    window.addEventListener('keydown', this.#onEsc)
  }
  unlisten() {
    window.removeEventListener('keydown', this.#onEsc)
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.persistent) this.listen()
    this.model = true
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    if (!this.persistent) this.unlisten()
  }

  override render() {
    return html`
      <div
        part="dialog-container"
        class="relative !origin-center z-10 bg-neutral-900 border-neutral-800 border shadow-md shadow-neutral-900 rounded-md ${classMap(
          this.$c([this.wrapperClass])
        )}"
      >
        <slot name="top">
          <i
            part="dialog-close"
            class="absolute flex justify-center items-center right-4 top-4 w-6 h-6 text-2xl cursor-pointer"
            @click="${this.close}"
          >
            <i class="mdi mdi-close"></i>
          </i>
          <div part="dialog-header" class="w-full rounded-t-md p-4 pr-8 flex justify-between items-center text-base">
            <slot name="header"></slot></div
        ></slot>
        <slot name="center">
          <div part="dialog-body" class="p-4"><slot></slot></div>
        </slot>
        <slot name="bottom">
          <div part="dialog-footer" class="w-full p-4 rounded-b-md"><slot name="footer"></slot></div>
        </slot>
      </div>
      <!-- Overlay -->
      <div
        @click="${() => !this.persistent && this.close()}"
        part="dialog-overlay"
        class="z-0 absolute left-0 top-0 w-full h-full visible transition-all bg-black opacity-30"
      ></div>
    `
  }
}
