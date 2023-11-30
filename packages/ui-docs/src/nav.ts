import { customElement, TailwindElement, html, repeat } from '@riffian-web/ui/src/shared/TailwindElement'
import { names } from './data'
// Components
import '@riffian-web/ui/src/link'

import style from './index.css?inline'
@customElement('ui-docs-nav')
export class UIDocs extends TailwindElement(style) {
  override render() {
    return html`
      <div class="border p-4 rounded-md sticky top-4">
        <ul class="doc-nav">
          ${repeat(
            names,
            (name) =>
              html`<li>
                <ui-link href="/docs/${name}" nav exact class="capitalize">${name}</ui-link>
              </li>`
          )}
        </ul>
      </div>
    `
  }
}
