import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
// Components
import '@riffian-web/ui/src/button'
import './dialog'
import './social'
import emitter from '@riffian-web/core/src/emitter'
import { getSocials } from './action'

@customElement('create-album-btn')
export class CreateAlbumBtn extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) icon = false

  @state() dialogCreate = false
  @state() dialogBind = false
  @state() prompt = false
  @state() pending = false

  get disabled() {
    return !bridgeStore.bridge.account
  }

  open = async () => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      this.pending = true
      try {
        let socials = await getSocials(bridgeStore.bridge.account)
        if (socials.length == 0) this.prompt = true
        else this.dialogCreate = true
      } catch (e) {
        console.error(e)
      }
      this.pending = false
    }
  }

  close = () => (this.dialogCreate = false)

  render() {
    return html`<ui-button
        ?disabled=${this.pending}
        ?icon=${this.icon}
        ?text=${!this.icon}
        ?lg=${this.icon}
        ?sm=${!this.icon}
        @click="${this.open}"
        title="Upload your track"
        >${when(
          this.pending,
          () => html`<i class="i mdi mdi-loading"></i>`,
          () => (this.icon ? html`<i class="i mdi mdi-plus-circle"></i>` : html`Upload your track`)
        )}</ui-button
      >
      <!-- Prompt -->
      ${when(
        this.prompt,
        () => html`
          <ui-prompt
            button
            @close=${() => {
              this.prompt = false
              this.dialogBind = true
            }}
            ><div class="text-base">You need to bind your social account before upload a track</div></ui-prompt
          >
        `
      )}
      ${when(
        this.dialogBind,
        () => html`<create-social-dialog @close=${() => (this.dialogBind = false)}></create-social-dialog>`
      )}
      ${when(this.dialogCreate, () => html`<create-album-dialog @close=${this.close}></create-album-dialog>`)} `
  }
}
