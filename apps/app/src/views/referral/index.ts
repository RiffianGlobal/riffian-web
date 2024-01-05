// Components
import { ThemeElement, html, customElement, property } from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/input/text'
import '~/components/referral/bind'

// Style
import style from './index.css?inline'

@customElement('view-referral')
export class ViewReferral extends ThemeElement(style) {
  @property() address = ''

  render() {
    return html`<div class="view-referral">
      <div class="ui-container flex justify-center">
        <referral-bind .address=${this.address}></referral-bind>
      </div>
    </div>`
  }
}
