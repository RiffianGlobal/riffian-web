import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/dialog'
import '@riffian-web/ui/src/progress/ring'
import '@riffian-web/ui/src/progress/bar'
import '@riffian-web/ui/src/tip'

import style from './index.css?inline'
@customElement('ui-components')
export class UIComponents extends TailwindElement(style) {
  @property({ type: String }) class = ''
  @state() dialog = false
  @state() menu = false

  closeMenu = () => {
    this.menu = false
  }

  override render() {
    return html`<div class="border m-4 p-4 rounded-md ${this.class}">
      <!-- Button -->
      <p class="my-2 font-bold">Buttons</p>
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
      <!-- Dialog -->
      <p class="my-2 font-bold">Dialog</p>
      <ui-button sm @click=${() => (this.dialog = true)}>Open Dialog</ui-button>
      ${when(this.dialog, () => html`<ui-dialog @close=${() => (this.dialog = false)}></ui-dialog>`)}
      <!-- Progress -->
      <p class="my-2 font-bold">Progress</p>
      <div class="flex gap-8 items-center">
        <p class="w-8 h-8">
          <ui-progress-ring state .percent=${50} .randomTo="100"><span class="text-xs">50%</span></ui-progress-ring>
        </p>
        <p class="w-12 h-4"><ui-progress-bar state .percent=${50} .randomTo="100">2</ui-progress-bar></p>
      </div>
      <!-- Tip -->
      <p class="my-2 font-bold">Tip</p>
      <ui-tip>Hello world</ui-tip>
      <!-- Menu -->
      <div>
        <ui-drop
          .show=${this.menu}
          @change=${(e: CustomEvent) => (this.menu = e.detail)}
          btnText
          btnDense
          icon
          dropClass="w-72"
        >
          <span slot="button">Settings</span>
          <!-- Content -->

          <ul class="ui-select">
            <li @click="${this.closeMenu}">Option A</li>
            <li @click="${this.closeMenu}">Option B</li>
          </ul>
        </ui-drop>
      </div>
    </div>`
  }
}
