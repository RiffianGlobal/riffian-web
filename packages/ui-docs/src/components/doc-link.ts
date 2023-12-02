import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/link'

@customElement('doc-link')
export class DocLink extends TailwindElement('') {
  override render() {
    return html`
      <p class="flex w-full gap-8">
        <ui-link href="/">Go Home</ui-link>
        <ui-link href="https://google.com" open>Google</ui-link>
        <ui-link href="/" back><i class="i mdi mdi-chevron-left"></i>Go Back</ui-link>
      </p>
    `
  }
}
