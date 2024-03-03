import { customElement, ThemeElement, html, property } from '../shared/theme-element'
import { networkStore, StateController } from '@riffian-web/ethers/src/networks'
import { shortAddress } from '@riffian-web/ethers/src/utils'
// Components
import '../link'

import style from './tx-view.css?inline'
@customElement('tx-view')
export class TxView extends ThemeElement(style) {
  bindNetwork: any = new StateController(this, networkStore)
  @property({ type: Object }) tx: any

  get txScanUri() {
    const { hash } = this.tx
    if (!hash) return ''
    return `${networkStore.current.scan}/tx/${hash}`
  }

  override render() {
    return html`<ui-link class="uri mt-4" href="${this.txScanUri}" target="_blank" rel="noopener"
      >View Transaction: ${shortAddress(this.tx.hash)}</ui-link
    >`
  }
}
