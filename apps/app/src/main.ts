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
import '@riffian-web/ui/src/link'
import '@riffian-web/ui/src/block-number'
import { StateController, screenStore } from '@riffian-web/core/src/screen'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  bindScreen: any = new StateController(this, screenStore)
  @state() inRoot = false

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
    return html`<ui-header menuable full avatarOnly avatarSize="32">
        <div slot="logo" class="inline-flex justify-center items-center mr-4">
          <a class="inline-flex justify-center items-center font-bold" href="/"><i class="ui-logo"></i></a>
        </div>
        ${when(
          !screenStore.isMobi,
          () =>
            html`<ui-nav slot="right" class="font-bold"
              ><ui-link href="/" nav alias="/">HOME</ui-link>
              <ui-link href="/uservotes" nav>MY VOTES</ui-link>
              <ui-link href="/upload" nav>UPLOAD</ui-link>
            </ui-nav>`
        )}
        <div slot="right"><network-menu avatarOnly></network-menu></div>
        <div slot="center"><ui-link class="text-gray-600" href="/docs" nav>COMPONENTS</ui-link></div>
      </ui-header>
      <main class="ui-app-main">
        ${when(
          screenStore.isMobi,
          () =>
            html`<ui-nav
              class="fixed bottom-0 left-0 right-0 z-50 font-bold bg-zinc-700 rounded-t shadow-[0_-10px_15px_-3px_rgba(255,255,255,0.1)] pt-2"
            >
              <ui-link href="/" nav class="mx-2" alias="/"><i class="mdi mdi-home-outline"></i></ui-link>
              <ui-link href="/upload" nav class="mx-2"><i class="mdi mdi-file-upload-outline"></i></ui-link>
              <ui-link href="/uservotes" nav class="mx-2"><i class="mdi mdi-account-outline"></i></ui-link>
            </ui-nav>`
        )}
        <slot> </slot>
      </main>
      <ui-footer full>
        <div slot="block"></div>
        <div slot="right"><block-number></block-number></div>
      </ui-footer>`
  }
}

AppRoot({ routes })
