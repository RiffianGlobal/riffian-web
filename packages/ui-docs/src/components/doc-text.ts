import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/input/pwd'

@customElement('doc-text')
export class DocText extends TailwindElement('') {
  @state() inputPwd = ''
  @state() inputText = ''
  @state() inputTextErr = ''
  @state() pending = false
  async onInputText(e: CustomEvent) {
    this.inputText = e.detail
    this.inputTextErr = ''
    const len = this.inputText.length
    if (len && len < 4) {
      this.inputTextErr = 'Your input is too short'
    }
  }

  override render() {
    return html`
      <div class="flex gap-8 items-center">
        <ui-input-text
          @input=${this.onInputText}
          value=${this.inputText}
          placeholder="Enter your album name"
          required
          ?disabled=${this.pending}
        >
          <span slot="label">Album Name</span>
          <span slot="tip">
            <ui-link href="/help">How to?</ui-link>
          </span>
          <span slot="right" class="-mr-1">
            <ui-button @click="()=>{}" icon sm class="text-blue-500"><i class="mdi mdi-magnify text-lg"></i></ui-button>
          </span>
          <span slot="msg">
            ${when(this.inputTextErr, () => html`<span class="text-red-500">${this.inputTextErr}</span>`)}
          </span>
        </ui-input-text>
        <span>Your name is: ${when(!this.inputTextErr, () => html`<b>${this.inputText}</b>`)}</span>
      </div>
      <!-- Simple TextField -->
      <div class="flex flex-col gap-4 w-72">
        <ui-input-text
          sm
          @input=${this.onInputText}
          value=${this.inputText}
          placeholder="Enter your album name"
          required
          ?disabled=${this.pending}
        >
          <span slot="right">
            <i class="mdi mdi-account-outline"></i>
          </span>
        </ui-input-text>
        <!-- Simple Password -->
        <ui-input-pwd sm value=${this.inputPwd} placeholder="Enter your password" required ?disabled=${this.pending}>
        </ui-input-pwd>
      </div>
    `
  }
}
