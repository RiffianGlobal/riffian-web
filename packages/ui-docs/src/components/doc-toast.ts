import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/progress/ring'
import '@riffian-web/ui/progress/bar'
import '@riffian-web/ui/button'
import { toast } from '@riffian-web/ui/toast'

@customElement('doc-toast')
export class DocToast extends ThemeElement('') {
  open = () => toast.add({ summary: 'Title', detail: 'Some reason' })
  override render() {
    return html` <ui-button sm @click=${this.open} class="mb-4">Open</ui-button> `
  }
}
