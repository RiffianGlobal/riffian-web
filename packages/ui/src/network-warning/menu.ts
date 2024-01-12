import { customElement, ThemeElement, html, state, classMap, repeat, when } from '../shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { Networks } from '@riffian-web/ethers/src/networks'
// Components
import '../menu/drop'
import '../link'
import '../dialog/prompt'

import style from './menu.css?inline'

@customElement('network-menu')
export class NetworkMenu extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore.bridge.network)
  @state() pending = false
  @state() menu = false
  @state() promptMsg = ''
  @state() promptTitle = ''

  get bridge() {
    return bridgeStore.bridge
  }
  get network() {
    return this.bridge.network
  }
  get current() {
    return this.network.current
  }
  get native() {
    return this.current?.native
  }
  get networks() {
    return Object.values(Networks)
  }

  async switch(network: NetworkInfo) {
    this.menu = false
    this.pending = true
    try {
      await this.bridge.switchNetwork(network.chainId)
    } catch (err: any) {
      if (err.code !== 4001) {
        console.warn('switch network failed with error:', err)
        this.promptTitle = 'Switch network failed'
        this.promptMsg = err.details ?? err.message
      }
    }
    this.pending = false
  }

  override render() {
    return html`
      <ui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        icon
        btnSm
        btnText
        dropClass="w-12"
        btnClass="text"
      >
        <div slot="button" class="inline-flex justify-center items-center">
          <i class="ui-network-icon ${classMap(this.$c([this.native?.symbol]))}"></i>
        </div>
        <ul class="ui-option">
          ${repeat(
            this.networks,
            (network) =>
              html`<li @click="${() => this.switch(network)}" class="text-base">
                <i class="ui-network-icon ${classMap(this.$c([network.native?.symbol]))}"></i>
                ${network.title}
              </li>`
          )}
        </ul>
      </ui-drop>
      ${when(
        this.promptMsg,
        () =>
          html`<ui-prompt>
            <p slot="header">${this.promptTitle}</p>
            <p class="whitespace-pre text-md">${this.promptMsg}</p>
          </ui-prompt>`
      )}
    `
  }
}
