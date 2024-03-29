import { PropertyValues } from 'lit'
import { customElement, ThemeElement, html, classMap, state, when } from '../shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { networkStore } from '@riffian-web/ethers/src/networks'
import { sleep } from '@riffian-web/ethers/src/utils'

import style from './blockNumber.css?inline'

@customElement('block-number')
export class BlockNumber extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  bindNetwork: any = new StateController(this, networkStore)

  @state() pending = false

  get provider() {
    return bridgeStore.bridge.provider
  }
  get err() {
    return !this.provider?.ready || !bridgeStore.blockNumber
  }
  async motion() {
    this.pending = true
    await sleep(1300)
    this.pending = false
  }

  willUpdate(changedProps: PropertyValues<this>) {
    if (changedProps.has('pending')) return
    this.motion()
  }

  override render() {
    return html`
      <span
        class="blockNumber inline-flex items-center align-middle ${classMap({ pending: this.pending, err: this.err })}"
      >
        <span class="blockStat flex relative justify-center items-center">
          <i class="dot block"></i>
          <i class="mdi mdi-loading absolute pending"></i>
        </span>
        ${when(
          bridgeStore.blockNumber,
          () =>
            html`<a
              href=${`${networkStore.current.scan}/block/${bridgeStore.blockNumber}`}
              target="_blank"
              rel="noopener"
              >${bridgeStore.blockNumber}</a
            >`
        )}
      </span>
    `
  }
}
