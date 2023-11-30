import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'

@customElement('doc-loading')
export class DocLoading extends TailwindElement('') {
  override render() {
    return html`
      <div class="flex gap-4">
        <loading-icon></loading-icon>
        <loading-skeleton num="3"></loading-skeleton>
      </div>
    `
  }
}
