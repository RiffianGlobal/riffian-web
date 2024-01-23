import { ThemeElement, customElement, html, property } from './shared/theme-element'

@customElement('ui-ver')
export class UIVer extends ThemeElement('') {
  @property({ type: Boolean }) sm = false
  render() {
    return html`<span class="opacity-35">${import.meta.env.VITE_APP_VER}</span>`
  }
}
