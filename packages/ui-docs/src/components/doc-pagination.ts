import { customElement, ThemeElement, html, state } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/pagination'

@customElement('doc-pagination')
export class DocPagination extends ThemeElement('') {
  // Pagination
  @state() pending = false
  loaded = () => {
    this.pending = true
    console.log('load data')
    setTimeout(() => (this.pending = false), 200)
  }

  override render() {
    return html`
      <ui-pagination mode="click" .firstLoad=${false} .pending=${this.pending} @loadmore=${this.loaded}
        ><span slot="empty">No data yet.</span>
      </ui-pagination>
    `
  }
}
