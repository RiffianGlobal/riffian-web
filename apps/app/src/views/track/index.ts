import { ThemeElement, html, customElement, property } from '@riffian-web/ui/shared/theme-element'
import '~/components/track/votes'
import '~/components/track/detail'

// Style
import style from './index.css?inline'

@customElement('track-page')
export class TrackPage extends ThemeElement(style) {
  @property({ type: String }) addr = ''

  render() {
    return html`<div class="ui-container mx-auto flex flex-col place-content-center pt-6 lg_pt-12">
      <track-detail trackAddress=${this.addr}></track-detail>
      <div class="mt-6 md_mt-14">
        <div class="w-full inline-flex pb-2 border-b border-slate-50/10">
          <div class="py-1.5 px-3 text-base font-normal text-white/70 rounded-md">History</div>
        </div>
        <track-votes trackAddress=${this.addr}></track-votes>
      </div>
    </div>`
  }
}
