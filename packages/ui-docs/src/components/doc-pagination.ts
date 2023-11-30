import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/pagination'

@customElement('doc-pagination')
export class DocPagination extends TailwindElement('') {
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
