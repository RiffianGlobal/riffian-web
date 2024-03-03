import { customElement, ThemeElement, html, when, state, classMap, unsafeHTML } from '../shared/theme-element'
import { animate } from '@lit-labs/motion'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { networkStore } from '@riffian-web/ethers/src/networks'
import { screenStore } from '@lit-web3/base/screen'
// Components
import '../link'

import style from './network-warning.css?inline'
@customElement('network-warning')
export class NetworkWarning extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  bindScreen = new StateController(this, screenStore)
  bindNetwork: any = new StateController(this, networkStore)

  @state() pending = false

  get txt() {
    if (networkStore.unSupported) `Please connect to the Mainnet.`
    if (networkStore.mainnetOffline) return `Mainnet is not supported yet`
    if (!networkStore.isMainnet) return unsafeHTML(`You are currently connected to the <b>${networkStore.title}</b>`)
    return ''
  }
  get shown() {
    return networkStore.disabled || !networkStore.isMainnet
  }

  async switch() {
    this.pending = true
    await bridgeStore.bridge.switchNetwork(networkStore.default.chainId)
    this.pending = false
  }
  toggle(del = false) {
    const { style } = document.documentElement
    const attr = '--networkWarnH'
    del || !this.shown ? style.removeProperty(attr) : style.setProperty(attr, `${screenStore.md ? 48 : 24}px`)
  }
  fit = () => {
    this.toggle()
  }
  ro = new ResizeObserver(this.fit)

  connectedCallback() {
    super.connectedCallback()
    this.toggle()
    this.ro.observe(document.documentElement)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.toggle(true)
    this.ro.disconnect()
  }

  override render() {
    if (!this.shown) return
    return html`<span
      class="network-warning overflow-hidden w-full flex text-red-600 items-center px-2 justify-center text-center bg-gray-200 ${classMap(
        { shown: this.shown }
      )}"
      ${animate({ guard: () => this.shown, properties: ['opacity', 'height', 'visibility'] })}
    >
      <span class="flex justify-center items-center gap-1"
        ><i class="i mdi mdi-alert-outline font-bold"></i>${this.txt}</span
      >
      ${when(
        !networkStore.isDefaultNet,
        () =>
          html`<ui-link ?disabled=${this.pending} text class="ml-1" @click=${this.switch}
            >Switch to ${networkStore.default.title}</ui-link
          >`
      )}
    </span>`
  }
}
