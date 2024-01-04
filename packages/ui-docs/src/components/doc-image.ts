import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/img/loader'

@customElement('doc-image')
export class DocImage extends ThemeElement('') {
  get img() {
    return `https://cdn.mos.cms.futurecdn.net/4Vv43ekp8QVwL95So7Z8sb.jpg?${new Date().getTime()}`
  }
  override render() {
    return html`
      <p class="w-36">
        <img-loader src=${this.img} loading="lazy"></img-loader>
      </p>
    `
  }
}
