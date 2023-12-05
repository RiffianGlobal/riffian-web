import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'
import '~/components/uservotes/list'

// Style
import style from './index.css?inline'

@customElement('user-votes')
export class ViewTop extends TailwindElement(style) {
  render() {
    return html`<div class="top">
      <div class="ui-container relative flex justify-between items-center">
        <div class="flex items-center gap-3 lg_gap-4 lg_w-40">
          <p class="font-bold text-xl">My Votes</p>
        </div>
      </div>
      <div class="ui-container">
        <user-votes-list></user-votes-list>
      </div>
    </div>`
  }
}
