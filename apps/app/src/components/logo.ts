import { ThemeElement, customElement, html, property } from '@riffian-web/ui/shared/theme-element'

@customElement('loading-icon')
export class LoadingIcon extends ThemeElement('') {
  @property({ type: String }) type = 'inline'

  render() {
    return html`<strong>Riffian</strong>`
  }
}
