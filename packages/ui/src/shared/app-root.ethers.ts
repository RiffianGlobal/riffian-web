import useBridge, { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '@lit-web3/base/webcomponent-polyfills'
import emitter from '@lit-web3/base/emitter'
import { Router, routerGuard, type RouteConfig, fallbackRender, fallbackEnter } from '@lit-web3/router'
import { ThemeElement, html, customElement, keyed } from './theme-element'
import { debounce } from '@riffian-web/ethers/src/utils'
// Global Components
import '../toast'

import '~/variables-override.css' // -> /apps/*/src/variables-override.css
import '../c/g.css'

useBridge()

export default function ({ routes = <RouteConfig[]>[], hashMode = false } = {}) {
  routerGuard.inject()
  // App Root
  @customElement('app-root')
  class AppRoot extends ThemeElement('') {
    bindBridge: any = new StateController(this, bridgeStore)
    _router: any = routerGuard.init(
      new Router(this, routes, {
        hashMode,
        fallback: {
          render: fallbackRender,
          enter: async (params) => await fallbackEnter(this._router, params)
        }
      })
    )

    forceUpdate = debounce(() => this.requestUpdate(), 100)
    constructor() {
      super()
      emitter.on('force-request-update', () => this.forceUpdate())
    }

    render() {
      return html`
        ${keyed(bridgeStore.key, html`<app-main>${this._router.outlet()}</app-main>`)}
        <!-- Global components -->
        <ui-toast></ui-toast>
      `
    }
  }
  return AppRoot
}
