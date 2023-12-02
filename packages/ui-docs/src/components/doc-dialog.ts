import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/dialog'

@customElement('doc-dialog')
export class DocDialog extends TailwindElement('') {
  @state() dialog = false
  override render() {
    return html`
      <ui-button sm @click=${() => (this.dialog = true)}>Open Dialog</ui-button>
      ${when(this.dialog, () => html`<ui-dialog @close=${() => (this.dialog = false)}></ui-dialog>`)}
    `
  }
}
