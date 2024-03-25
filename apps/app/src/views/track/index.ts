import { ThemeElement, html, customElement, property, state, keyed } from '@riffian-web/ui/shared/theme-element'
import '~/components/track/votes'
import '~/components/track/detail'
import '~/components/tv/lite'

// Style
import style from './index.css?inline'

@customElement('track-page')
export class TrackPage extends ThemeElement(style) {
  @property({ type: String }) addr = ''

  @state() subject: any = null

  onChange = (e: CustomEvent) => {
    this.subject = e.detail
  }

  render() {
    return html`${keyed(
      this.addr,
      html`<div class="ui-container mx-auto flex flex-col place-content-center pt-6 lg_pt-12">
        <track-detail @change=${this.onChange} trackAddress=${this.addr}></track-detail>
        <chart-tv-lite class="my-4" .pair=${this.addr}></chart-tv-lite>
        <div class="my-4">
          <div class="w-full inline-flex pb-2 border-b border-slate-50/10">
            <div class="py-1.5 px-2 lg_px-3 text-base font-normal text-white/70 rounded-md">Voting Chart</div>
          </div>
          <track-votes trackAddress=${this.addr}></track-votes>
        </div>
      </div>`
    )}`
  }
}
