import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'

// Style
import style from './index.css?inline'

@customElement('view-settings')
export class ViewSettings extends ThemeElement(style) {
  render() {
    return html`<div class="ui-container">
      <div class="ui-container">
        <p>Settings</p>
      </div>
    </div>`
  }
}
