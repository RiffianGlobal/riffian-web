import { customElement, ThemeElement, html, state, when, property, classMap } from '../shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { walletStore } from '@riffian-web/ethers/src/wallet'
import { networkStore } from '@riffian-web/ethers/src/networks'
import emitter from '@lit-web3/base/emitter'
// Components
import '../address'
import '../menu/drop'
import '../copy/icon'
import '../button'

import style from './btn.css?inline'
@customElement('connect-wallet-btn')
export class ConnectWalletBtn extends ThemeElement(style) {
  bindNetwork: any = new StateController(this, networkStore)
  bindBridge: any = new StateController(this, bridgeStore)
  bindWallet: any = new StateController(this, walletStore)
  @property({ type: Boolean }) dropable = false
  @property({ type: Boolean }) hideAddr = false

  @state() menu = false

  get account() {
    return walletStore.account
  }
  get addr() {
    return walletStore.shortAccount
  }
  get scan() {
    return `${networkStore.current.scan}/address/${this.account}`
  }

  show = () => {
    if (this.dropable && walletStore.doid) {
      this.menu = !this.menu
    } else {
      bridgeStore.bridge.select(0)
    }
  }
  close() {}

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
    if (!bridgeStore.bridge.alreadyTried) return html`<i class="mdi mdi-loading"></i>`
    if (this.account)
      return html`<ui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        ?icon=${this.dropable}
        btnSm
        text
        dropClass=""
        btnClass="text"
      >
        <ui-button icon slot="toggle"
          ><ui-address .address=${this.account} avatar ?hideAddr=${this.hideAddr} short></ui-address
        ></ui-button>
        <!-- Content -->
        <div class="flex w-full justify-between items-center gap-4 py-3 px-3">
          <div class="flex items-center">
            <span class="inline-flex items-center gap-2">
              <ui-address .address=${this.account} short doid avatar></ui-address>
            </span>
            <span class="inline-flex items-center">
              <ui-copy-icon title="Copy" .value=${this.account}></ui-copy-icon>
              <ui-button title="View" sm icon href=${this.scan}><i class="mdi mdi-open-in-new"></i></ui-button
            ></span>
          </div>
          <div>
            <ui-button title="Disconnect" sm icon @click=${() => bridgeStore.bridge.disconnect()}
              ><i class="mdi mdi-link-variant-off"></i
            ></ui-button>
          </div>
        </div>
        <slot name="submenu"></slot>
      </ui-drop>`
    // Dialog Button
    else return html` <ui-button class="outlined" sm @click=${() => this.show()}>Sign In</ui-button> `
  }
}
