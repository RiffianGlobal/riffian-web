import { customElement, ThemeElement, html, when, property, state, classMap } from '../shared/theme-element'

import style from './doid.css?inline'

const suffix = '.doid'
const reg = new RegExp(`${suffix}$`)

@customElement('ui-doid')
export class UIDoid extends ThemeElement(style) {
  @property() doid?: string | undefined

  get name() {
    return this.doid ? this.doid.replace(reg, '') : ''
  }

  override render() {
    if (!this.doid) return ''
    return html`${this.name}<span class="opacity-50">${suffix}</span>`
  }
}
