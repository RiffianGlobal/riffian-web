import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'
import '~/components/top/list'
import '~/components/createAlbum/btn'
import '~/components/createAlbum/socialbtn'

// Style
import style from './index.css?inline'

@customElement('view-top')
export class ViewTop extends ThemeElement(style) {
  render() {
    return html`<div class="top">
      <div class="ui-container relative flex justify-between items-center">
        <div class="flex items-center gap-3 lg_gap-4 lg_w-40">
          <p class="font-bold text-xl">Weekly</p>
        </div>
        <div class="flex justify-end items-center lg_w-40">
          <bind-social-btn></bind-social-btn>
        </div>
        <div class="flex justify-end items-center lg_w-40">
          <create-album-btn></create-album-btn>
        </div>
      </div>
      <top-album></top-album>
    </div>`
  }
}
