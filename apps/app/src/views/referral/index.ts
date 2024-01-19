import { isAddress } from 'ethers'
import { ThemeElement, html, customElement, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { StateController, referralStore } from '~/components/referral/store'
import { goto } from '@lit-web3/router'
// Components
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/loading/icon'
import '~/components/referral/bind'

// Style
import style from './index.css?inline'

@customElement('view-referral')
export class ViewReferral extends ThemeElement(style) {
  bindReferral: any = new StateController(this, referralStore)

  @property() referral = ''
  @state() address = ''

  get isAddress() {
    return isAddress(this.referral)
  }

  validate = async () => {
    this.address = this.referral
    return false
    const Invalid = false
    if (Invalid) goto('/')
  }

  async connectedCallback() {
    super.connectedCallback()
    referralStore.check()
    await this.validate()
  }

  render() {
    return html`<div class="ui-pageview ui-container flex-col justify-center text-center">
      <h3 class="text-center mt-20 text-3xl font-bold uppercase">Compose your assets with us</h3>

      ${when(
        referralStore.inited,
        () =>
          html`${when(
              !referralStore.bound,
              () =>
                html`<div>
                  <h4><ui-link>${this.address}</ui-link></h4>
                  <p class="mt-2">Invite you to join Riffian</p>
                </div>`
            )}<bind-referral .address=${this.address}></bind-referral>`,
        () => html`<loading-icon type="block"></loading-icon>`
      )}
    </div>`
  }
}
