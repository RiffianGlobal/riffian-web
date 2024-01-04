import { ThemeElement, html, customElement, when, property, state, classMap } from '../shared/theme-element'
import { screenStore, StateController } from '@lit-web3/base/screen'
// Components
import '../connect-wallet/btn'
import '../link'
import '../button'

import style from './header.css?inline'
@customElement('ui-header')
export class UIHeader extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  @property({ type: Boolean }) menuable = false
  @property({ type: Boolean }) fixed = false
  @property({ type: Boolean }) full = false
  @property({ type: String }) logoHref = 'https://riffian.global'
  @property({ type: String }) class = ''
  @state() menuActive = false

  get asMenu() {
    return this.menuable && screenStore.isMobi
  }
  toggleMenu() {
    this.menuActive = !this.menuActive
  }
  closeMenu = (e: any) => {
    if (!e.target?.classList?.contains('nav-menu-body')) {
      setTimeout(() => (this.menuActive = false))
      return
    }
    e.stopImmediatePropagation()
    e.preventDefault()
    this.menuActive = false
  }

  onSlotChange(e: any) {
    const $slot = e.target
    if (!$slot) {
      return
    }
    const childNodes = $slot.assignedNodes({
      flatten: true
    })
    console.log($slot, childNodes, childNodes[0].innerHTML)

    if (!childNodes.length) {
      // $slot.style.display = 'none'
    }
  }
  render() {
    return html`
      ${when(this.fixed, () => html`<div class="ui-header-placeholder"></div>`)}
      <header class="ui-header ${classMap({ fixed: this.fixed })}">
        <div class="ui-container relative flex justify-between items-center ${classMap({ full: this.full })}">
          <div class="flex items-center gap-3 lg_gap-4 lg_w-40">
            <slot name="logo"><a class="ui-logo" href=${this.logoHref}></a><slot name="sublogo"></slot></slot>
            <slot name="left"></slot>
          </div>
          <div class="flex justify-center items-center">
            ${when(!this.asMenu, () => html`<slot name="center"></slot>`)}
          </div>
          <div class="flex justify-end items-center gap-2 lg_w-60">
            <slot name="right"></slot>
            <slot name="wallet"
              ><connect-wallet-btn hideAddr dropable>
                <div slot="submenu">
                  <slot name="submenu"></slot></div></connect-wallet-btn
            ></slot>
            ${when(
              this.asMenu,
              () =>
                html`<div
                    @click=${this.toggleMenu}
                    class="mr-1 nav-menu-btn flex flex-col items-center content-center justify-center z-40 ${classMap(
                      this.$c([this.menuActive ? 'active fixed' : 'absolute'])
                    )}"
                  >
                    <div class="nav-menu-btn-1"></div>
                  </div>
                  <div
                    @click=${this.closeMenu}
                    class="nav-menu-body grid place-content-center ${classMap({ active: this.menuActive })}"
                  >
                    <slot name="center"></slot>
                  </div>`
            )}
          </div>
        </div>
      </header>
    `
  }
}
