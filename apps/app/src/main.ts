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

@customElement('app-main')
export class AppMain extends TailwindElement('') {
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
    return html` <ui-header menuable full>
        <div slot="logo" class="inline-flex justify-center items-center mr-4">
          <a class="inline-flex justify-center items-center font-bold" href="/"><i class="ui-logo"></i></a>
        </div>
        <ui-nav slot="left" menuable>
          <ui-link href="/" nav alias="/">Top Hits</ui-link>
          <ui-link href="/uservotes" nav>My Votes</ui-link>
          <ui-link href="/docs" nav>Docs</ui-link>
        </ui-nav>
        <div slot="right"><network-menu></network-menu></div>
      </ui-header>
      <main class="ui-app-main pt-6">
        <slot></slot>
      </main>
      <ui-footer full>
        <div slot="block"></div>
        <div slot="right"><block-number></block-number></div>
      </ui-footer>`
  }
}

AppRoot({ routes })
