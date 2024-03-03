import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
// Components
import '@riffian-web/ui/button'
import '~/components/reward/dialog'
import emitter from '@lit-web3/base/emitter'

@customElement('bind-social-btn')
export class BindSocialBtn extends ThemeElement('') {
  bindWallet: any = new StateController(this, walletStore)

  @state() dialog = false

  get disabled() {
    return !walletStore.account
  }

  open = () => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      this.dialog = true
    }
  }

  close = () => (this.dialog = false)

  render() {
    return html`<ui-button icon @click="${this.open}" title="Bind Social"><i class="i mdi mdi-twitter"></i></ui-button>
      ${when(
        this.dialog,
        () => html`<reward-dialog scene="social" @close=${() => (this.dialog = false)}></reward-dialog>`
      )} `
  }
}
