import { customElement, property, state, ThemeElement } from '@riffian-web/ui/shared/theme-element'
import { html, unsafeStatic } from 'lit/static-html.js'
// Code Highlight
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
// Components
import './nav'
import './components'

import style from './index.css?inline'
@customElement('doc-code')
export class DocCode extends ThemeElement(style) {
  @property() cmp = ''
  @state() html = ''

  getCode = async () => {
    const { default: code } = await import(`./components/doc-${this.cmp}.ts?raw`)
    this.html = Prism.highlight(code, Prism.languages.javascript, 'javascript')
  }

  connectedCallback() {
    super.connectedCallback()
    this.getCode()
  }
  override render() {
    if (!this.html) return ''
    return html`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css" />
      <pre class="doc-code language-ts w-full h-96 !text-xs">${unsafeStatic(this.html)}</pre> `
  }
}
