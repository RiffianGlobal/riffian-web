import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'
import '~/components/top/list'

// Style
import style from './index.css?inline'

@customElement('view-top')
export class ViewTop extends TailwindElement(style) {
  render() {
    return html`<div class="top">
      <div class="ui-container">
        <p class="font-bold text-xl">Top Music</p>
      </div>
      <top-album></top-album>
    </div>`
  }
}
