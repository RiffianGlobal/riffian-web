import AppRoot from '@riffian-web/ui/src/shared/AppRoot.ethers'
import emitter from '@riffian-web/core/src/emitter'
import { routerPathroot } from '@riffian-web/ui/src/shared/router'
import { routes } from '~/router'
import { TailwindElement, html, customElement, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/network-warning/menu'
import '@riffian-web/ui/src/nav/header'
import '@riffian-web/ui/src/nav/footer'
import '@riffian-web/ui/src/nav/nav'
import '@riffian-web/ui/src/block-number'
import { StateController, screenStore } from '@riffian-web/core/src/screen'
import '~/components/createAlbum/btn'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  bindScreen: any = new StateController(this, screenStore)
  @state() inRoot = false

  get isMobi() {
    return screenStore.isMobi
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
    return html`<ui-header full>
        <div slot="logo" class="inline-flex justify-center items-center mr-4">
          <a class="inline-flex justify-center items-center font-bold" href="/"><i class="ui-logo"></i></a>
        </div>
        ${when(
          !this.isMobi,
          () =>
            html`<ui-nav slot="right" class="font-bold text-2xl">
              <ui-link href="/" nav alias="/">HOME</ui-link>
              <ui-link href="/uservotes" nav>MY VOTES</ui-link>
              <create-album-btn></create-album-btn>
            </ui-nav>`
        )}
        <div slot="right"><network-menu></network-menu></div>
        <ui-link slot="left" href="https://faucet.fantom.network/" class="text-neutral-400">FAUCET</ui-link>
      </ui-header>
      <main class="ui-app-main">
        ${when(
          screenStore.isMobi,
          () =>
            html`<ui-nav
              class="fixed bottom-2 left-2 right-2 z-50 border border-neutral-800 bg-neutral-900 rounded-2xl space-x-2"
            >
              <ui-link href="/" nav alias="/"><i class="mdi mdi-home-outline text-3xl"></i></ui-link>
              <create-album-btn icon></create-album-btn>
              <ui-link href="/uservotes" nav><i class="mdi mdi-account-outline text-3xl"></i></ui-link>
            </ui-nav>`
        )}
        <slot> </slot>
      </main>
      <ui-footer full>
        <div slot="block"></div>
        <div slot="right" class="flex">
          ${when(
            !(import.meta.env.MODE === 'production'),
            () => html`<ui-link class="text-sm text-gray-600 mr-2" href="/docs">COMPONENTS</ui-link>`
          )}
          <block-number></block-number>
        </div>
      </ui-footer>`
  }
}

AppRoot({ routes })
