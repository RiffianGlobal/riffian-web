import { ThemeElement, html, customElement, property } from '@riffian-web/ui/shared/theme-element'
import '~/components/track/voters'
import '~/components/track/track'

// Style
import style from './index.css?inline'

@customElement('track-page')
export class TrackPage extends ThemeElement(style) {
  @property({ type: String }) addr = ''

  render() {
    return html`<div class="flex px-8 space-x-8 place-content-center">
      <div class="flex-initial w-[64rem]">
        <div class="h-20 pt-1 mb-8">
          <div class="font-bold text-xl">
            <track-detail trackAddress=${this.addr}> </track-detail>
          </div>
        </div>
        <div class="h-10 pt-1 mt-20">
          <div class="font-bold text-xl">VOTERS</div>
        </div>
        <div class="mt-0">
          <voter-list trackAddress=${this.addr}></voter-list>
        </div>
      </div>
    </div>`
  }
}
