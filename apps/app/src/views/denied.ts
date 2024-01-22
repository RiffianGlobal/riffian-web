import { ThemeElement, html, customElement } from '@riffian-web/ui/shared/theme-element'
import { Domain } from '~/constants'

@customElement('view-denied')
export class ViewDenied extends ThemeElement('') {
  back = () => (location.href = `https://${Domain}`)
  render() {
    return html`<div class="z-50 fixed w-screen h-screen top-0 left-0 bgBlur active">
      <div
        class="z-50 fixed w-screen h-screen flex justify-center items-center flex-col top-0 left-0 pb-20 text-center gap-3"
      >
        <h6 class="text-2xl mb-6">Unable to load App</h6>
        <div>
          <p>Please try again later.</p>
          <p>Our service is currently unavailable in your region.</p>
        </div>
        <p><ui-link @click=${this.back} href=${`https://${Domain}`}>Back to ${Domain}</ui-link></p>
      </div>
    </div>`
  }
}
