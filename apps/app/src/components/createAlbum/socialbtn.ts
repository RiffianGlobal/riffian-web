import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
// Components
import '@riffian-web/ui/button'
import './social'
import emitter from '@lit-web3/base/emitter'

@customElement('bind-social-btn')
export class BindSocialBtn extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)

  @state() dialog = false

  get disabled() {
    return !bridgeStore.bridge.account
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
      ${when(this.dialog, () => html`<create-social-dialog @close=${this.close}></create-social-dialog>`)} `
  }
}
