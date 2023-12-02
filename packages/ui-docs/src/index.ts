import { customElement, TailwindElement, html } from '@riffian-web/ui/src/shared/TailwindElement'
import { goto } from '@riffian-web/ui/src/shared/router'
// Components
import './nav'
import './components'

import style from './index.css?inline'
@customElement('ui-docs')
export class UIDocs extends TailwindElement(style) {
  override render() {
    return html`
      <div class="flex gap-4">
        <ui-docs-nav class="w-48"></ui-docs-nav>
        <ui-components class="flex-grow"></ui-components>
      </div>
    `
  }
}
