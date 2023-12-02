import { TailwindElement, html, customElement, classMap, property } from '../shared/TailwindElement'
import { screenStore, StateController } from '@riffian-web/core/src/screen'

import style from './nav.css?inline'
@customElement('ui-nav')
export class UINav extends TailwindElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  @property({ type: Boolean }) menuable = false
  get asMenu() {
    return this.menuable && screenStore.isMobi
  }

  render() {
    return html`
      <nav class="flex gap-2 justify-center items-center ${classMap({ 'flex-col': this.asMenu })}">
        <slot></slot>
      </nav>
    `
  }
}
