import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'
import '~/components/uservotes/list'

// Style
import style from './index.css?inline'

@customElement('user-votes')
export class ViewTop extends ThemeElement(style) {
  render() {
    return html`<div class="md_max-w-7xl mx-auto flex flex-col place-content-center pt-12">
      <div>
        <div class="w-full inline-flex pb-6 border-b border-slate-50/10">
          <div class="py-1.5 px-3 text-base font-normal bg-sky-300/10  text-white/70 rounded-md">My Votes</div>
        </div>
      </div>
      <user-votes-list></user-votes-list>
    </div>`
  }
}
