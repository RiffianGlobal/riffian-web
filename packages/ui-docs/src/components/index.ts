import {
  customElement,
  TailwindElement,
  repeat,
  property,
  state,
  classMap
} from '@riffian-web/ui/src/shared/TailwindElement'
import { html, unsafeStatic } from 'lit/static-html.js'
import { routerPathname } from '@riffian-web/ui/src/shared/router'
import emitter from '@riffian-web/core/src/emitter'
// Components
import { cmps, names, loadComponents } from '../data'

import style from './cmp.css?inline'
@customElement('ui-components')
export class UIComponents extends TailwindElement(style) {
  @property({ type: String }) class = ''
  @state() pathname = routerPathname()

  get activeCmp() {
    return ''
  }
  updatePathName = () => {
    this.pathname = routerPathname()
    console.log(this.pathname)
  }
  get anchor() {
    return this.pathname.replace(/^\/docs\//, '')
  }

  override render() {
    return html`<div class="border p-4 rounded-md ${this.class}">
      ${repeat(
        cmps,
        (cmp, i) =>
          html`<div name="${names[i]}" class="doc-intro ${classMap({ active: this.anchor === names[i] })}">
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
