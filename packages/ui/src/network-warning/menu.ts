import { customElement, TailwindElement, html, when, state, classMap, repeat } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { Networks } from '@riffian-web/ethers/src/networks'
// Components
import '../menu/drop'
import '../link'

import style from './menu.css?inline'

const networks = Object.values(Networks)

@customElement('network-menu')
export class NetworkMenu extends TailwindElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  @state() pending = false
  @state() menu = false

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

  async switch(network: NetworkInfo) {
    this.menu = false
    this.pending = true
    await this.bridge.switchNetwork(network.chainId)
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
        <ul class="ui-select">
          ${repeat(
            networks,
            (network) =>
              html`<li @click="${() => this.switch(network)}">
                <i class="ui-network-icon ${classMap(this.$c([network.native?.symbol]))}"></i>
                ${network.title}
              </li>`
          )}
        </ul>
      </ui-drop>
    `
  }
}
