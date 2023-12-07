import { customElement, TailwindElement, html, when, property, classMap } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { screenStore } from '@riffian-web/core/src/screen'
import { shortAddress } from '@riffian-web/ethers/src/utils'
// Components
import './avatar'
import '../link'
import '../copy/icon'

import style from './address.css?inline'
@customElement('ui-address')
export class UIAddress extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindScreen: any = new StateController(this, screenStore)
  @property() address?: string // !!! if not defined, use current wallet address
  @property({ type: Boolean }) avatar = false
  @property({ type: Boolean }) avatarOnly = false
  @property({ type: Number }) avatarSize = 16
  @property({ type: Boolean }) copy = false
  @property({ type: Boolean }) short = false // if false, auto short address
  @property() href?: string

  get addr() {
    return typeof this.address === 'string' ? this.address : bridgeStore.bridge.account
  }
  get isLink() {
    return typeof this.href === 'string'
  }
  get showAddr() {
    return this.short || screenStore.screen.isMobi ? shortAddress(this.addr) : this.addr
  }

  override render() {
    return html`${when(
      this.avatar,
      () =>
        html`<ui-address-avatar
          size=${this.avatarSize}
          class="${classMap({ 'mr-1.5': !this.avatarOnly })}"
          .address=${this.addr}
        ></ui-address-avatar>`
    )}${when(!this.avatarOnly, () => {
      if (this.isLink) {
        return html`<ui-link href=${this.href}>${this.showAddr}</ui-link>`
      } else {
        return html`${this.showAddr}`
      }
    })}${when(this.copy, () => html`<ui-copy-icon .value=${this.addr}></ui-copy-icon>`)}`
  }
}
