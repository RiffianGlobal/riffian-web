import {
  customElement,
  ThemeElement,
  repeat,
  property,
  state,
  when,
  classMap
} from '@riffian-web/ui/shared/theme-element'
import { html, unsafeStatic } from 'lit/static-html.js'
import { routerPathname } from '@lit-web3/router'
import emitter from '@lit-web3/base/emitter'
// Components
import { cmps, names, loadComponents } from '../data'
import '@riffian-web/ui/tip'
import '../code'

import style from './cmp.css?inline'
@customElement('ui-components')
export class UIComponents extends ThemeElement(style) {
  @property({ type: String }) class = ''
  @state() pathname = routerPathname()
  @state() currentCode = ''

  get anchor() {
    return this.pathname.replace(/^\/docs\//, '')
  }

  updatePathName = () => {
    this.pathname = routerPathname()
  }

  override render() {
    return html` <div class="border p-4 rounded-md ${this.class}">
      ${repeat(
        cmps,
        (cmp, i) =>
          html`<div class="doc-intro ${classMap({ active: this.anchor === names[i] })}">
            <h6 name="${names[i]}" class="">
              <ui-tip @close=${() => (this.currentCode = '')} @click=${() =>
                (this.currentCode =
                  names[i])}><i slot="icon" class="text-gray-500 text-base mdi mdi-xml cursor-pointer"></i>${when(
                this.currentCode === names[i],
                () => html`<doc-code .cmp=${names[i]}></doc-code>`
              )}</ui-tip>
            </h6>
            <${unsafeStatic(cmp)}></${unsafeStatic(cmp)}>
          </div>`
      )}
    </div>`
  }

  connectedCallback() {
    super.connectedCallback()
    loadComponents()
    emitter.on('router-change', this.updatePathName)
  }
}
