import { customElement, ThemeElement, html, when, property, state } from '../shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { screenStore } from '@lit-web3/base/screen'
import { shortAddress } from '@riffian-web/ethers/src/utils'
// Components
import './avatar'
import '../link'
import '../copy/icon'

import style from './address.css?inline'

@customElement('ui-address')
export class UIAddress extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindScreen: any = new StateController(this, screenStore)
  @property() address?: string // !!! if not defined, use current wallet address
  @property({ type: Boolean }) avatar = false
  @property({ type: Boolean }) hideAddr = false
  @property({ type: Boolean }) copy = false
  @property({ type: Boolean }) short = false // if false, auto short address
  @property() href?: string
  @state() doid?: string

  get addr() {
    return typeof this.address === 'string' ? this.address : bridgeStore.bridge.account
  }
  get isLink() {
    return typeof this.href === 'string'
  }
  get showAddr() {
    if (!this.doid && this.addr)
      bridgeStore.bridge.provider?.lookupAddress(this.addr).then((name) => (this.doid = name ?? ''))
    let showAddr = this.short || screenStore.screen.isMobi ? shortAddress(this.addr) : this.addr
    return this.doid
      ? `${this.doid}(${showAddr})`
      : this.doid === undefined
        ? html`<i class="mdi mdi-loading"></i> (${showAddr})`
        : showAddr
  }

  override render() {
    return html`
      <!-- Avatar -->
      ${when(this.avatar, () => html`<ui-address-avatar .address=${this.addr}></ui-address-avatar>`)}
      <!-- Address -->
      ${when(!this.hideAddr, () =>
        this.isLink ? html`<ui-link href=${this.href}>${this.showAddr}</ui-link>` : html`${this.showAddr}`
      )}
      <!-- Copy -->
      ${when(this.copy, () => html`<ui-copy-icon .value=${this.addr}></ui-copy-icon>`)}
    `
  }
}
