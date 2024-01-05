import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/tip'

@customElement('doc-tip')
export class DocTip extends ThemeElement('') {
  override render() {
    return html` <ui-tip>Hello world</ui-tip> `
  }
}
