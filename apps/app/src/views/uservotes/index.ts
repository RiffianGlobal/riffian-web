import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'
import '~/components/uservotes/list'

// Style
import style from './index.css?inline'

@customElement('user-votes')
export class ViewTop extends ThemeElement(style) {
  render() {
    return html`<div class="flex px-8 space-x-8 place-content-center">
      <div class="flex-initial w-[64rem]">
        <div class="h-20 pt-1 mb-8">
          <div class="font-bold text-xl">My Votes</div>
        </div>
        <div class="mt-0">
          <user-votes-list></user-votes-list>
        </div>
      </div>
    </div>`
  }
}
