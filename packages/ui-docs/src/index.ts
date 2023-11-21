import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/dialog'

import style from './index.css?inline'
@customElement('ui-components')
export class UIComponents extends TailwindElement(style) {
  @property({ type: String }) class = ''
  @state() dialog = false
  open() {
    this.dialog = true
  }
  close() {
    this.dialog = false
  }

  override render() {
    return html`<div class="border m-4 p-4 rounded-md ${this.class}">
      <p class="my-2 font-bold">UI Buttons</p>
      <!--  -->
      <ui-button>Normal</ui-button>
      <ui-button disabled>Disabled</ui-button>
      <ui-button pending>Pending</ui-button>
      <ui-button icon><i class="mdi mdi-check"></i></ui-button>
      <ui-button class="outlined">Outlined</ui-button>
      <ui-button><i class="mdi mdi-check -ml-1 mr-1"></i>Icon Left</ui-button>
      <ui-button>Icon Right<i class="mdi mdi-check -mr-1 ml-1"></i></ui-button>
      <br />
      <ui-button href="">link href</ui-button><ui-button text>Text</ui-button>
      <br />
      <ui-button sm>Small</ui-button>
      <p class="my-2 font-bold">UI Dialog</p>
      <ui-button sm @click=${this.open}>Open Dialog</ui-button>
      ${when(this.dialog, () => html`<ui-dialog @close=${this.close}></ui-dialog>`)}
    </div>`
  }
}
