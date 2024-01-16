import { customElement, ThemeElement, html, when, property, state, classMap } from '../shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { screenStore } from '@lit-web3/base/screen'
import { shortAddress } from '@riffian-web/ethers/src/utils'
import { DOIDStore } from '@riffian-web/ethers/src/doid-resolver'
import { type PropertyValues } from 'lit'
// Components
import './avatar'
import '../link'
import '../copy/icon'

import style from './address.css?inline'

@customElement('ui-address')
export class UIAddress extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindScreen: any = new StateController(this, screenStore)
  bindDOID: any = new StateController(this, DOIDStore)

  @property({ type: String }) address = undefined // !!! if not defined, use current wallet address
  @property({ type: Boolean }) avatar = false
  @property({ type: Boolean }) hideAddr = false
  @property({ type: Boolean }) copy = false
  @property({ type: Boolean }) short = false // if false, auto short address
  @property() href?: string
  @state() doid?: string

  get addr() {
    return (typeof this.address === 'string' ? this.address : bridgeStore.bridge.account) ?? ''
  }
  get isLink() {
    return typeof this.href === 'string'
  }
  get showAddr() {
    return this.short || screenStore.screen.isMobi ? shortAddress(this.addr) : this.addr
  }
  get showAddrHTML() {
    if (this.doid === '') return this.showAddr
    return html`${when(
        !this.doid,
        () => html`<i class="mdi mdi-loading"></i>`,
        () => this.doid
      )}<q class="q">${this.showAddr}</q>`
  }

  solveDOID = async () => {
    if (this.doid || !this.addr) return
    try {
      this.doid = (await DOIDStore.get(this.addr)) ?? ''
    } catch {}
  }

  willUpdate(props: PropertyValues<this>) {
    if (props.has('address')) this.solveDOID()
  }

  connectedCallback() {
    super.connectedCallback()
    this.solveDOID
  }

  override render() {
    return html`
      <!-- Avatar -->
      ${when(this.avatar, () => html`<ui-address-avatar .address=${this.addr}></ui-address-avatar>`)}
      <!-- Address -->
      ${when(!this.hideAddr, () =>
        this.isLink ? html`<ui-link href=${this.href}>${this.showAddrHTML}</ui-link>` : html`${this.showAddrHTML}`
      )}
      <!-- Copy -->
      ${when(this.copy, () => html`<ui-copy-icon .value=${this.addr}></ui-copy-icon>`)}
    `
  }
}
