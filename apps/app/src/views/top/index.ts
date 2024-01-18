import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'
// import '~/components/createAlbum/btn'
// import '~/components/createAlbum/socialbtn'
import '~/components/top/list'

// Style
import style from './index.css?inline'

@customElement('view-top')
export class ViewTop extends ThemeElement(style) {
  render() {
    return html`
      <div class="ui-container relative flex justify-between items-center">
        <top-album paging pageSize="15" .brief=${false} class="w-full"></top-album>
      </div>
    `
  }
}
