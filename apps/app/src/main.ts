import emitter from '@lit-web3/base/emitter'
import { routerPathroot } from '@lit-web3/router'
import { StateController, screenStore } from '@lit-web3/base/screen'
import { rewardStore } from '~/store/reward'
import { routes } from '~/router'
import { ThemeElement, html, customElement, state, when } from '@riffian-web/ui/shared/theme-element'
import { walletStore } from '@riffian-web/ethers/src/wallet'
import { init } from '~/lib/events-keeper'
// Components
import AppRoot from '@riffian-web/ui/shared/app-root.ethers'
import '@riffian-web/ui/network-warning/menu'
import '@riffian-web/ui/nav/header'
import '@riffian-web/ui/nav/footer'
import '@riffian-web/ui/nav/nav'
import '@riffian-web/ui/block-number'
import '@riffian-web/ui/ui-ver'
import '~/lib/sentry'
import '~/components/createAlbum/btn'
import '~/components/reward/btn'
import '~/components/user/balance'

import '~/global.css'

@customElement('app-main')
export class AppMain extends ThemeElement('') {
  bindScreen: any = new StateController(this, screenStore)
  bindStore: any = new StateController(this, rewardStore)
  bindWallet: any = new StateController(this, walletStore)

  constructor() {
    super()
    init()
  }

  @state() inRoot = false

  get isMobi() {
    return screenStore.isMobi
  }

  chkView = () => {
    this.inRoot = routerPathroot() === '/'
  }
  openReward = () => {
    emitter.emit('reward-show')
  }

  connectedCallback() {
    super.connectedCallback()
    this.chkView()
    emitter.on('router-change', this.chkView)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('router-change', this.chkView)
  }

  render() {
    return html`<ui-header full>
        <div slot="logo" class="inline-flex justify-center items-center mr-4">
          <a class="inline-flex justify-center items-center font-bold" href="/"><i class="ui-logo beta"></i></a>
        </div>

        <div slot="right">
          <div class="inline-flex items-center gap-4">
            ${when(walletStore.account, () => html`<reward-btn></reward-btn>`)}
            <network-menu></network-menu>
          </div>
        </div>
        ${when(
          walletStore.account && !this.isMobi,
          () =>
            html`<div slot="balance">
              <account-balance class="ui-em"></account-balance>
            </div>`
        )}

        <div slot="submenu">
          <div class="mx-4 pt-3 border-t border-white/15">
            <div class="flex justify-between">
              <span class="text-xs text-white/60">DOID Balance:</span>
              <account-balance class="ui-em text-xs"></account-balance>
            </div>
          </div>
        </div>
        <div slot="left" class="w-full flex justify-start items-center gap-4 ml-4">
          ${when(
            !this.isMobi,
            () =>
              html` <ui-nav slot="right" class="text-lg">
                <ui-link href="/" nav alias="/">Home</ui-link>
                <ui-link href="/profile" nav>Profile</ui-link>
                <create-album-btn btnClass="opacity-60"></create-album-btn>
              </ui-nav>`
          )}
        </div>
      </ui-header>
      <main class="ui-app-main">
        ${when(
          screenStore.isMobi,
          () =>
            html`<ui-nav
              class="fixed bottom-0 left-0 right-0 z-50 border-t border-white/25"
              style="background-color: rgba(22, 24, 49, 1)"
            >
              <div class="w-full grid grid-cols-4 justify-center items-center">
                <div class="flex flex-col justify-center items-center">
                  <ui-link href="/" nav alias="/">
                    <i class="mdi mdi-home-outline text-2xl"></i>
                  </ui-link>
                </div>
                <div class="flex flex-col justify-center items-center">
                  <create-album-btn icon btnClass="p-0 text-2xl"></create-album-btn>
                </div>
                <div class="flex flex-col justify-center items-center">
                  <i class="mdi mdi-gift-outline text-2xl" @click=${this.openReward}></i>
                </div>
                <div class="flex flex-col justify-center items-center">
                  <ui-link href="/profile" nav class="!opacity-100"
                    ><i class="mdi mdi-account-outline text-2xl"></i
                  ></ui-link>
                </div>
              </div>
            </ui-nav>`
        )}
        <slot> </slot>
      </main>
      <ui-footer full>
        <div slot="block"></div>
        <div slot="center"><ui-ver></ui-ver></div>
        <div slot="right" class="flex gap-6 text-xs">
          ${when(!(import.meta.env.MODE === 'production'), () => html`<ui-link href="/docs">Components</ui-link>`)}
          <block-number></block-number>
        </div>
      </ui-footer>`
  }
}

AppRoot({ routes })
