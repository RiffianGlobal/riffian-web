import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'
import '~/components/uservotes/list'

// Style
import style from './index.css?inline'

@customElement('user-votes')
export class ViewTop extends ThemeElement(style) {
  render() {
    return html`<div class="ui-pageview ui-container">
      <div class="ui-board">
        <div class="ui-board-header">
          <div class="ui-board-lead">
            <h5>My Votes</h5>
          </div>
        </div>
        <user-votes-list by="id"></user-votes-list>
      </div>
    </div>`
  }
}
