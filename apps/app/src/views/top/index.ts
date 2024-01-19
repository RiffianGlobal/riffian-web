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
      <div class="ui-pageview ui-container place-content-center relative flex flex-col">
        <div class="ui-board">
          <div class="ui-board-header">
            <div class="ui-board-lead">
              <h5>Top</h5>
            </div>
          </div>
          <top-album paging pageSize="15" .brief=${false} class="w-full"></top-album>
        </div>
      </div>
    `
  }
}
