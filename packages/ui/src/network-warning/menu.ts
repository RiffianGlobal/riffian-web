import { customElement, ThemeElement, html, state, classMap, repeat, when } from '../shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { Networks, networkStore } from '@riffian-web/ethers/src/networks'
// Components
import '../menu/drop'
import '../link'
import '../dialog/prompt'

import style from './menu.css?inline'

@customElement('network-menu')
export class NetworkMenu extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindNetwork: any = new StateController(this, networkStore)

  @state() pending = false
  @state() menu = false
  @state() promptMsg = ''
  @state() promptTitle = ''

  get current() {
    return networkStore.current
  }
  get native() {
    return this.current?.native
  }
  get networks() {
    return Object.values(Networks)
  }

  cut = (s: string) => s.substring(0, 1)

  async switch(network: NetworkInfo) {
    this.menu = false
    this.pending = true
    try {
      await bridgeStore.bridge.switchNetwork(network.chainId)
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
    if (!networkStore.unSupported && this.networks.length == 1) return ''
    return html`
      <ui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        icon
        btnSm
        btnText
        dropClass="w-12"
        btnClass="text -ml-1.5 lg_ml-auto"
      >
        <div slot="button" class="inline-flex justify-center items-center">
          ${when(
            this.pending,
            () => html`<i class="mdi mdi-loading"></i>`,
            () => html`
              <i
                acronym=${this.cut(this.current.title)}
                class="ui-network-icon ${classMap(
                  this.$c([
                    this.current.native?.symbol,
                    { testnet: !this.current.mainnet, unknown: networkStore.unSupported }
                  ])
                )}"
              ></i>
            `
          )}
        </div>
        <ul class="ui-option">
          ${repeat(
            this.networks,
            (network) =>
              html`<li
                @click="${() => this.switch(network)}"
                class="text-base ${classMap({ active: network.chainId === this.current.chainId })}"
              >
                <i
                  acronym=${this.cut(network.title)}
                  class="ui-network-icon ${classMap(this.$c([network.native?.symbol, { testnet: !network.mainnet }]))}"
                ></i>
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
