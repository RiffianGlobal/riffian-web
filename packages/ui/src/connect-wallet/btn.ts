import { customElement, TailwindElement, html, state, when, property, classMap } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import emitter from '@riffian-web/core/src/emitter'
// Components
import './dialog'
import '../address'
import '../menu/drop'
import '../copy/icon'

import style from './btn.css?inline'
@customElement('connect-wallet-btn')
export class ConnectWalletBtn extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) dropable = false

  @state() dialog = false
  @state() menu = false

  get account() {
    return bridgeStore.account
  }
  get addr() {
    return bridgeStore.bridge?.shortAccount
  }
  get scan() {
    return `${bridgeStore.bridge?.network.current.scan}/address/${bridgeStore.bridge?.account}`
  }

  show = () => {
    if (this.dropable && this.account) {
      this.menu = !this.menu
    } else {
      this.dialog = true
    }
  }
  close() {
    this.dialog = false
  }

  connectedCallback(): void {
    super.connectedCallback()
    emitter.on('connect-wallet', this.show)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    emitter.off('connect-wallet', this.show)
  }

  render() {
    // Dropdown Button
    if (this.account)
      return html`<ui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        ?icon=${this.dropable}
        btnSm
        text
        dropClass="w-72"
        btnClass="text"
      >
        <ui-address slot="button" avatar short></ui-address>
        <span slot="icon"></span>
        <!-- Content -->
        <div class="flex w-full justify-between items-center py-3 pl-4 pr-2">
          <div class="flex items-center space-x-2">
            <ui-address-avatar></ui-address-avatar>
            <span>${this.addr}</span>
            <span>
              <ui-copy-icon .value=${this.account}></ui-copy-icon>
              <ui-button sm icon href=${this.scan}><i class="mdi mdi-open-in-new"></i></ui-button
            ></span>
          </div>
          <div>
            <ui-button sm icon @click=${() => bridgeStore.bridge.disconnect()}
              ><i class="mdi mdi-link-variant-off"></i
            ></ui-button>
          </div>
        </div>
        <slot name="submenu"></slot>
      </ui-drop>`
    // Dialog Button
    else
      return html`
        <ui-button class="outlined" sm @click=${() => (this.dialog = true)}>Connect Wallet</ui-button>
        <!-- Dialog -->
        ${when(this.dialog, () => html`<connect-wallet-dialog @close=${this.close}></connect-wallet-dialog>`)}
      `
  }
}
