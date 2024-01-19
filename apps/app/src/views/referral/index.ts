import { isAddress } from 'ethers'
import { ThemeElement, html, customElement, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { StateController, referralStore } from '~/components/referral/store'
import { DOIDStore } from '@riffian-web/ethers/src/doid-resolver'
import { goto, replace } from '@lit-web3/router'
// Components
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/loading/icon'
import '~/components/referral/bind-referrer'

// Style
import style from './index.css?inline'

@customElement('view-referral')
export class ViewReferral extends ThemeElement(style) {
  bindReferral: any = new StateController(this, referralStore)
  bindDOID: any = new StateController(this, DOIDStore)

  @property() referrer = ''
  @state() address = ''
  @state() resolved = false

  // get address() {
  //   return referralStore.address
  // }

  get isAddress() {
    return isAddress(this.referrer)
  }

  validate = async () => {
    // this.address = this.referrer
    // return false
    // const Invalid = false
    // if (Invalid) goto('/')
  }

  resolve = async () => {
    const bound = await referralStore.get()
    if (bound) this.address = bound
    else {
      const isAddr = isAddress(this.referrer)
      if (isAddr) {
        this.address = this.referrer
      } else {
        const addr = await DOIDStore.getAddress(this.referrer)
        if (addr) this.address = addr
      }
    }
    if (this.address) this.resolved = true
    else goto('/')
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.resolve()
  }

  render() {
    const referrer = html`<ui-address
      .href=${`/user/${this.address}`}
      .address="${this.address}"
      short
      avatar
    ></ui-address>`
    return html`<div class="ui-pageview ui-container flex-col justify-center items-center">
      <h3 class="text-center mt-20 text-3xl font-bold uppercase">Compose your assets with us</h3>
      <div class="text-center text-base">
        ${when(
          referralStore.inited && this.resolved,
          () =>
            html`${when(
              referralStore.bound,
              () =>
                html`<div class="flex flex-col text-center gap-2">
                  <span class="opacity-80">You have been invited by:</span>
                  <p>${referrer}</p>
                </div>`,
              () => html`
                <h4>${referrer}</h4>
                <p class="mt-2 opacity-80">invite you to join Riffian</p>
                <bind-referrer .address=${this.address}></bind-referrer>
              `
            )}`,
          () => html`<loading-icon type="block"></loading-icon>`
        )}
      </div>
    </div>`
  }
}
