import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
// Components
import '@riffian-web/ui/button'
import './dialog'
import '~/components/reward/dialog'
import emitter from '@lit-web3/base/emitter'
import { getSocials } from './action'

import style from './btn.css?inline'
@customElement('create-album-btn')
export class CreateAlbumBtn extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) icon = false
  @property({ type: String }) btnClass = ''

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

  connectedCallback(): void {
    super.connectedCallback()
    // TODO: event triggerable elements should be moved to main.ts
    emitter.on('ui-bindsocial', () => {
      this.dialogBind = true
    })
  }

  render() {
    return html`<span
        ?disabled=${this.pending}
        ?icon=${this.icon}
        @click="${this.open}"
        class="${this.btnClass}"
        title="Upload your track"
        >${when(
          this.pending,
          () => html`<i class="i mdi mdi-loading"></i>`,
          () =>
            this.icon
              ? html`<i class="mdi mdi-tray-arrow-up ${this.icon ? 'text-2xl' : '!text-base'} text-white"></i>`
              : html`Upload`
        )}</span
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
        () => html`<reward-dialog scene="social" @close=${() => (this.dialogBind = false)}></reward-dialog>`
      )}
      ${when(this.dialogCreate, () => html`<create-album-dialog @close=${this.close}></create-album-dialog>`)} `
  }
}
