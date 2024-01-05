import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/progress/ring'
import '@riffian-web/ui/progress/bar'

@customElement('doc-progress')
export class DocProgress extends ThemeElement('') {
  override render() {
    return html`
      <div class="flex gap-8 items-center">
        <p class="w-12">
          <ui-progress-ring state .percent=${66} .randomTo="100"><span class="text-xs">66%</span></ui-progress-ring>
        </p>
        <p class="w-12"><ui-progress-bar state .percent=${80} .randomTo="100">2</ui-progress-bar></p>
        <p class="w-12"><ui-progress-bar .percent=${40}></ui-progress-bar></p>
      </div>
    `
  }
}
