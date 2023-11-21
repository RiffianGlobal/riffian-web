import { TailwindElement, customElement, html, property } from '../shared/TailwindElement'

@customElement('loading-icon')
export class LoadingIcon extends TailwindElement('') {
  @property({ type: String }) type = 'inline'

  render() {
    return html`<strong>Riffian</strong>`
  }
}
