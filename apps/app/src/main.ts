import AppRoot from '@riffian-web/ui/src/shared/AppRoot.ethers'
import emitter from '@riffian-web/core/src/emitter'
import { routerPathroot } from '@riffian-web/ui/src/shared/router'
import { routes } from '~/router'
import { TailwindElement, html, customElement, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/network-warning'
import '@riffian-web/ui/src/nav/header'
import '@riffian-web/ui/src/nav/footer'
import '@riffian-web/ui/src/nav/nav'
import '@riffian-web/ui/src/link'

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
    return html`<network-warning></network-warning>
      <ui-header menuable>
        <div slot="logo"><a class="text-base lg_text-lg font-semibold" href="/">Riffian</a></div>
        <ui-nav slot="center" menuable>
          <ui-link href="/" nav alias="/">Home</ui-link>
          <ui-link href="/top" nav>Top Music</ui-link>
          <ui-link href="/docs" nav>Docs</ui-link>
        </ui-nav>
      </ui-header>
      <main class="ui-app-main pt-6">
        <slot></slot>
      </main>
      <ui-footer>
        <div slot="center" class="text-xs">
          Powered by <ui-link class="ml-0.5 underline underline-offset-2 !text-inherit" href="">Riffian</ui-link>
        </div>
        <div slot="right"></div>
      </ui-footer>`
  }
}

AppRoot({ routes })
