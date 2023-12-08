// Todo: ShadowRoot should be created as childNodes of document.body
import { customElement, TailwindElement, html, state, property, classMap } from '../shared/TailwindElement'
import type { TAILWINDELEMENT } from '../shared/TailwindElement'
import { sleep } from '@riffian-web/ethers/src/utils'
import { animate } from '@lit-labs/motion'

import style from './dialog.css?inline'

@customElement('ui-dialog')
export class UIDialog extends TailwindElement(style) implements TAILWINDELEMENT {
  @property({ type: Boolean }) persistent = false
  @state() model = false

  close = async () => {
    this.model = false
    this.unlisten()
    await sleep(160) // Anamition timeout
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
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    if (!this.persistent) this.unlisten()
  }

  override render() {
    setTimeout(() => {
      this.model = true
    })
    return html`
      <div
        part="dialog-container"
        class="relative !origin-center z-10 bg-neutral-900 border-neutral-800 border shadow-md shadow-neutral-900 rounded-md ${classMap(
          this.$c([this.model ? 'scale-100 opacity-100 visible' : 'scale-75 opacity-0 invisible'])
        )}"
        ${animate({
          guard: () => this.model,
          properties: ['opacity', 'visibility', 'margin', 'transform'],
          keyframeOptions: { duration: 200 }
        })}
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
        class="z-0 absolute left-0 top-0 w-full h-full visible bg-black ${this.model ? 'opacity-40' : 'opacity-0'}"
        ${animate({ guard: () => this.model })}
      ></div>
    `
  }
}
