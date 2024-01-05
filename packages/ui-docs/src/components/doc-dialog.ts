import { customElement, ThemeElement, html, when, state } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/dialog'
import '@riffian-web/ui/dialog/prompt'
import '@riffian-web/ui/dialog/confirm'

@customElement('doc-dialog')
export class DocDialog extends ThemeElement('') {
  @state() dialog = false
  @state() prompt = false
  @state() confirm = false
  @state() confirmed = false
  onConfirm = () => {
    this.confirmed = true
    this.confirm = false
  }
  override render() {
    return html`
      <p class="flex w-full gap-2 my-2 items-center">
        <ui-button sm @click=${() => (this.dialog = true)}>Simple Dialog</ui-button>
        <ui-button sm @click=${() => (this.prompt = true)}>Prompt</ui-button>
        <ui-button sm @click=${() => (this.confirm = true)}>Confirm</ui-button> Confirmed: ${this.confirmed}
      </p>
      <!-- Simple Dialog -->
      ${when(
        this.dialog,
        () => html`
          <ui-dialog @close=${() => (this.dialog = false)}
            ><p slot="header">Title</p>
            Content
            <p slot="footer">Footer</p></ui-dialog
          >
        `
      )}
      <!-- Prompt -->
      ${when(
        this.prompt,
        () => html`
          <ui-prompt button @close=${() => (this.prompt = false)}
            ><div class="text-base">Some Message here</div></ui-prompt
          >
        `
      )}
      <!-- Confirm -->
      ${when(
        this.confirm,
        () => html`
          <ui-confirm button @close=${() => (this.confirm = false)} @confirm=${this.onConfirm}
            ><div slot="header">Use location service?</div>
            <div class="text-base">
              Let us help apps determine location. This means sending anonymouse location data to use.
            </div></ui-confirm
          >
        `
      )}
    `
  }
}
