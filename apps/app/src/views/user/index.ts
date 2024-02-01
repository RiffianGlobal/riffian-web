import { ThemeElement, html, customElement, property } from '@riffian-web/ui/shared/theme-element'
import '~/components/user/tracks'
import '~/components/user/user'

// Style
import style from './index.css?inline'

@customElement('user-page')
export class TrackPage extends ThemeElement(style) {
  @property({ type: String }) addr = ''

  render() {
    return html`<div class="ui-container mx-auto flex flex-col place-content-center md_pt-10">
      <!-- user profile -->
      <user-detail .address=${this.addr} class="md_mx-auto"></user-detail>

      <!-- created -->
      <div class="w-full inline-flex pb-2 border-b border-slate-50/10">
        <div class="py-1.5 px-3 text-base font-normal text-white/70 rounded-md">Tracks</div>
      </div>
      <track-list .address=${this.addr}></track-list>
    </div>`
  }
}
