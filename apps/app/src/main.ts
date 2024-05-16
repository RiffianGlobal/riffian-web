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
import '@riffian-web/ui/address/doid'
import '~/lib/sentry'
import '~/components/createAlbum/btn'
import '~/components/reward/btn'
import '~/components/user/balance'
import '~/components/search'
import '@riffian-web/ui/tip/rookie'
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
  get acc() {
    return walletStore.account
  }

  chkView = () => {
    this.inRoot = routerPathroot() === '/'
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
    return html` <!-- Header -->
      <ui-header full>
        <!-- Left -->
        <div slot="logo" class="inline-flex justify-center items-center mr-4">
          <a class="inline-flex justify-center items-center font-bold" href="/"><i class="ui-logo beta"></i></a>
        </div>
        ${when(
          this.isMobi,
          () =>
            html`<network-menu slot="left"></network-menu>

              ${when(
                this.acc,
                () =>
                  html`<div slot="right" class="flex flex-col text-xs leading-none justify-center items-end w-full">
                    <ui-doid .doid=${walletStore.doid}></ui-doid>
                    <account-balance class="ui-em text-[10px]"></account-balance>
                  </div>`
              )} `,
          () =>
            html`<div slot="right">
                <div class="inline-flex items-center gap-4">
                  ${when(this.acc, () => html`<reward-btn></reward-btn>`)}
                  <!-- <network-menu></network-menu> -->
                  <ui-doid .doid=${walletStore.doid}></ui-doid>
                </div>
              </div>
              ${when(
                this.acc,
                () =>
                  html`<div slot="balance">
                    <account-balance class="ui-em"></account-balance>
                  </div>`
              )}`
        )}

        <!-- Dropdown -->
        <div slot="submenu">
          <div class="mx-4 pt-3 border-t border-white/15">
            <div class="flex justify-between">
              <span class="text-xs text-white/60">DOID Balance:</span>
              <account-balance class="ui-em text-xs"></account-balance>
            </div>
          </div>
        </div>

        ${when(
          !this.isMobi,
          () =>
            html`<div slot="left" class="w-full flex justify-start items-center gap-4 ml-4">
              <ui-nav class="text-lg">
                <ui-link href="/" nav alias="/">Home</ui-link>
                <ui-link href="/profile" nav>Profile</ui-link>
                <create-album-btn btnClass="opacity-60"></create-album-btn>
                <ui-link href="https://doc.riffian.global/riffian-global" nav>Help</ui-link>
              </ui-nav>
            </div>`
        )}
        ${when(
          !this.isMobi,
          () =>
            html`<div slot="center" class="flex px-4 lg_w-80 xl_w-96 items-center justify-center">
              <object-search></object-search>
            </div>`
        )}
      </ui-header>
      <!-- Main -->
      <main class="ui-app-main mt-0 lg_mt-0">
        <!-- <ui-tip-rookie></ui-tip-rookie> -->
        ${when(
          this.isMobi,
          () =>
            html`<!-- Search in Mobi -->
              <div class="ui-pageview ui-container place-content-center relative flex flex-col bottom-line pb-2">
                <object-search></object-search>
              </div>
              <!-- Nav in Mobi -->
              <ui-nav
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
                    <reward-btn><i class="mdi mdi-gift-outline text-2xl"></i></reward-btn>
                  </div>
                  <div class="flex flex-col justify-center items-center">
                    <ui-link href="/profile" nav class="!opacity-100"
                      ><i class="mdi mdi-account-outline text-2xl"></i
                    ></ui-link>
                  </div>~
                </div>
              </ui-nav>`
        )}
        <slot></slot>
      </main>
      <!-- Footer -->
      <ui-footer full>
        <div slot="left">
          ${when(this.isMobi, () => html`<ui-link href="https://doc.riffian.global/riffian-global">Help</ui-link>`)}
          ${when(
            import.meta.env.MODE !== 'production' && !this.isMobi,
            () => html`<ui-link href="/docs">Components</ui-link>`
          )}
        </div>
        <div slot="center"><ui-ver class="pb-20 lg_pb-0"></ui-ver></div>
        <div slot="right" class="flex gap-6 text-xs">
          ${when(!this.isMobi, () => html`<ui-link href="https://doc.riffian.global/riffian-global">Help</ui-link>`)}
          <block-number></block-number>
        </div>
      </ui-footer>`
  }
}

AppRoot({ routes })
