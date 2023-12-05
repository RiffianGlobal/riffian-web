import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
// Components
import '@riffian-web/ui/src/button'
import './dialog'
import './social'

@customElement('create-album-btn')
export class CreateAlbumBtn extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)

  @state() dialog = false

  get disabled() {
    return !bridgeStore.bridge.account
  }

  open = () => (this.dialog = true)

  close = () => (this.dialog = false)

  render() {
    return html`<ui-button icon lg @click="${this.open}" ?disabled="${this.disabled}" title="New Album"
        ><i class="i mdi mdi-plus-circle"></i
      ></ui-button>
      ${when(this.dialog, () => html`<create-album-dialog @close=${this.close}></create-album-dialog>`)} `
  }
}
