import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/img/loader'

@customElement('doc-image')
export class DocImage extends TailwindElement('') {
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
