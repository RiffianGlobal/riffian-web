import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/progress/ring'
import '@riffian-web/ui/progress/bar'
import { toast } from '@riffian-web/ui/toast'

@customElement('doc-toast')
export class DocToast extends ThemeElement('') {
  open = () => toast.add({ summary: 'Title', detail: 'Some reason' })
  override render() {
    return html` <button @click=${this.open} class="flex gap-8 items-center">Open</button> `
  }
}
