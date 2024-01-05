import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'

@customElement('doc-loading')
export class DocLoading extends ThemeElement('') {
  override render() {
    return html`
      <div class="flex gap-4">
        <loading-icon></loading-icon>
        <loading-skeleton num="3"></loading-skeleton>
      </div>
    `
  }
}
