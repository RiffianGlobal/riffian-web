import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/tip'

@customElement('doc-tip')
export class DocTip extends TailwindElement('') {
  override render() {
    return html` <ui-tip>Hello world</ui-tip> `
  }
}
