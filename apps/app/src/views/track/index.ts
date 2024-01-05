import { TailwindElement, html, customElement, property } from '@riffian-web/ui/src/shared/TailwindElement'
import '~/components/track/voters'
import '~/components/track/track'

// Style
import style from './index.css?inline'

@customElement('track-page')
export class TrackPage extends TailwindElement(style) {
  @property({ type: String }) addr = ''

  render() {
    return html`<div class="md_max-w-7xl mx-auto flex flex-col place-content-center pt-12">
      <track-detail trackAddress=${this.addr}> </track-detail>
      <div class="mt-14">
        <div class="w-full inline-flex pb-6 border-b border-slate-50/10">
          <div class="py-1.5 px-3 text-base font-normal bg-sky-300/10  text-white/70 rounded-md">Voters</div>
        </div>
        <voter-list trackAddress=${this.addr}></voter-list>
      </div>
    </div>`
  }
}
