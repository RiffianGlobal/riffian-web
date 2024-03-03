import { customElement, ThemeElement, html, when, property, state, classMap } from '../shared/theme-element'
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
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
  bindWallet: any = new StateController(this, walletStore)
  bindScreen: any = new StateController(this, screenStore)
  bindDOID: any = new StateController(this, DOIDStore)

  @property({ type: String }) address = undefined
  @property({ type: Boolean }) avatar = false
  @property({ type: Boolean }) hideAddr = false
  @property({ type: Boolean }) self = false
  @property({ type: Boolean }) copy = false
  @property({ type: Boolean }) short = false // if false, auto short address
  @property() href?: string

  @state() doid?: string

  get addr() {
    return (typeof this.address === 'string' ? this.address : '') ?? ''
  }
  get isLink() {
    return typeof this.href === 'string'
  }
  get showAddr() {
    return this.short || screenStore.screen.isMobi ? shortAddress(this.addr) : this.addr
  }
  get pending() {
    return this.doid === undefined
  }

  renderAddr = () => {
    // if (this.doid === '') return this.wrapLink(this.showAddr)
    return html`${when(
        this.pending,
        () => html`<i class="mdi mdi-loading"></i>`,
        () => this.wrapLink(html`<span class="name">${this.doid}</span>`)
      )}<q class="q">${this.showAddr}</q>`
  }
  wrapLink = (_html: unknown) => (this.isLink ? html`<ui-link href=${this.href}>${_html}</ui-link>` : _html)

  solveDOID = async () => {
    if (!this.addr) return
    this.doid = (await DOIDStore.getDOID(this.addr)) ?? ''
  }

  willUpdate(props: PropertyValues<this>) {
    if (props.has('address')) this.solveDOID()
  }

  connectedCallback() {
    super.connectedCallback()
    this.solveDOID()
  }
  disconnectedCallback() {
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <!-- Avatar -->
      ${when(this.avatar, () => html`<ui-address-avatar .address=${this.addr}></ui-address-avatar>`)}
      <!-- Address -->
      ${when(!this.hideAddr, this.renderAddr)}
      <!-- Copy -->
      ${when(this.copy, () => html`<ui-copy-icon .value=${this.addr}></ui-copy-icon>`)}
    `
  }
}
