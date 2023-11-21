import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'

// Style
import style from './index.css?inline'
import logo from '~/assets/logo.svg'

@customElement('view-settings')
export class ViewSettings extends TailwindElement(style) {
  render() {
    return html`<div class="settings">
      <div class="ui-container my-4">
        <img class="w-24 object-contain select-none pointer-events-none" src="${logo}" />
      </div>
      <div class="ui-container">
        <p>Settings</p>
      </div>
    </div>`
  }
}
