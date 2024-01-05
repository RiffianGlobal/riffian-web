import { ThemeElement, html, property, classMap, customElement } from '../shared/theme-element'
// Components
import '../link'

import style from './footer.css?inline'
@customElement('ui-footer')
export class UIFooter extends ThemeElement(style) {
  @property({ type: Boolean }) full = false
  render() {
    return html`
      <footer class="ui-footer">
        <div class="ui-container flex justify-between items-center gap-4${classMap({ full: this.full })}">
          <div class="flex gap-3 items-center opacity-80 lg_w-40">
            <slot name="left"></slot>
          </div>
          <div class="flex justify-center items-center text-center">
            <slot name="center"></slot>
          </div>
          <div class="flex gap-3 justify-end items-center lg_w-40">
            <slot name="right"></slot>
          </div>
        </div>
      </footer>
    `
  }
}
