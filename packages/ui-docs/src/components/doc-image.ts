import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/img/loader'

@customElement('doc-image')
export class DocImage extends TailwindElement('') {
  override render() {
    return html`
      <p class="w-24">
        <img-loader
          src="https://upload.wikimedia.org/wikipedia/en/1/18/Black_hole_Interstellar.png"
          loading="lazy"
        ></img-loader>
      </p>
    `
  }
}
