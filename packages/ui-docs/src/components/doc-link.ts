import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/link'

@customElement('doc-link')
export class DocLink extends ThemeElement('') {
  override render() {
    return html`
      <div class="flex w-full items-center gap-8">
        <p class="inline-flex gap-8">
          <ui-link href="/">Go Home</ui-link>
          <ui-link href="https://google.com" open>Google</ui-link>
          <ui-link href="/" back><i class="i mdi mdi-chevron-left"></i>Go Back</ui-link>
        </p>
        <p class="inline-flex items-center gap-2">
          <span>Navs:</span>
          <ui-link href="/docs" nav exact>/docs</ui-link>
          <ui-link href="/docs/button" nav exact>/docs/button</ui-link>
        </p>
      </div>
    `
  }
}
