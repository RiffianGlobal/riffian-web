import { TailwindElement, html, customElement, property } from '@riffian-web/ui/src/shared/TailwindElement'
import '~/components/user/tracks'
import '~/components/user/user'

// Style
import style from './index.css?inline'

@customElement('user-page')
export class TrackPage extends TailwindElement(style) {
  @property({ type: String }) addr = ''

  render() {
    return html`<div class="flex px-8 space-x-8 place-content-center">
      <div class="flex-initial w-[64rem]">
        <div class="h-20 pt-1 mb-8">
          <div class="font-bold text-xl">
            <user-detail address=${this.addr}> </user-detail>
          </div>
        </div>
        <div class="h-10 pt-1 mt-20">
          <div class="font-bold text-xl">Tracks</div>
        </div>
        <div class="mt-0">
          <track-list address=${this.addr}></track-list>
        </div>
      </div>
    </div>`
  }
}
