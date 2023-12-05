import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'

// Style
import style from './index.css?inline'

@customElement('view-settings')
export class ViewSettings extends TailwindElement(style) {
  render() {
    return html`<div class="settings">
      <div class="ui-container">
        <p>Settings</p>
      </div>
    </div>`
  }
}
