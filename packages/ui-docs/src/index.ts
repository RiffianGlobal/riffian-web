import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/dialog'
import '@riffian-web/ui/src/progress/ring'
import '@riffian-web/ui/src/progress/bar'
import '@riffian-web/ui/src/tip'
import '@riffian-web/ui/src/link'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/pagination'
import '@riffian-web/ui/src/address'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/input/switch'
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/input/pwd'

import style from './index.css?inline'
@customElement('ui-components')
export class UIComponents extends TailwindElement(style) {
  @property({ type: String }) class = ''
  @state() dialog = false
  @state() menu = false
  @state() address = '0x82487df5b4cf19db597a092c8103759466be9e5a'
  // Pagination
  @state() pagePending = false
  pageLoad = () => {
    this.pagePending = true
    console.log('load data')
    setTimeout(() => (this.pagePending = false), 200)
  }
  // Transaction
  @state() tx = null
  @state() txErr = ''
  get txPending() {
    return false
  }
  // Menu
  closeMenu = () => {
    this.menu = false
  }
  // Input Switch
  @state() inputSwitch = false
  // Text Field
  @state() inputPwd = ''
  @state() inputText = ''
  @state() inputTextErr = ''
  async onInputCode(e: CustomEvent) {
    this.inputText = e.detail
    this.inputTextErr = this.txErr = ''
    const len = this.inputText.length
    if (len && len < 4) {
      this.inputTextErr = 'Invalid or expired invitation code'
    }
  }

  override render() {
    return html`<div class="border m-4 p-4 rounded-md ${this.class}">
      <!-- Button -->
      <div name="Button" class="doc-intro">
        <p class="flex w-full gap-2 my-2">
          <ui-button>Normal</ui-button>
          <ui-button disabled>Disabled</ui-button>
          <ui-button pending>Pending</ui-button>
          <ui-button sm>Small</ui-button>
          <ui-button sm dense>Dense</ui-button>
        </p>
        <p class="flex w-full gap-2 my-2">
          <ui-button icon><i class="mdi mdi-check"></i></ui-button>
        </p>
        <p class="flex w-full gap-2 my-2">
          <ui-button class="outlined">Outlined</ui-button>
          <ui-button text>Text</ui-button>
          <ui-button href="">link href</ui-button>
        </p>
        <p class="flex w-full gap-2 my-2">
          <ui-button><i class="mdi mdi-check -ml-1 mr-1"></i>Icon Left</ui-button>
          <ui-button>Icon Right<i class="mdi mdi-check -mr-1 ml-1"></i></ui-button>
        </p>
      </div>
      <!-- Link -->
      <div name="Link" class="doc-intro">
        <p class="flex w-full gap-8">
          <ui-link href="/">Go Home</ui-link>
          <ui-link href="https://google.com" open>Google</ui-link>
          <ui-link href="/" back><i class="i mdi mdi-chevron-left"></i>Go Back</ui-link>
        </p>
      </div>
      <!-- Address -->
      <div name="Address" class="doc-intro">
        <p class="flex w-full gap-8">
          <ui-address :address="${this.address}" short href="https://riffian.web"></ui-address>
          <ui-address :address="${this.address}" short avatar></ui-address>
          <ui-address :address="${this.address}" short avatar copy></ui-address>
        </p>
      </div>
      <!-- Dialog -->
      <div name="Dialog" class="doc-intro">
        <ui-button sm @click=${() => (this.dialog = true)}>Open Dialog</ui-button>
        ${when(this.dialog, () => html`<ui-dialog @close=${() => (this.dialog = false)}></ui-dialog>`)}
      </div>
      <!-- Progress -->
      <div name="Progress" class="doc-intro">
        <div class="flex gap-8 items-center">
          <p class="w-12">
            <ui-progress-ring state .percent=${66} .randomTo="100"><span class="text-xs">66%</span></ui-progress-ring>
          </p>
          <p class="w-12"><ui-progress-bar state .percent=${80} .randomTo="100">2</ui-progress-bar></p>
          <p class="w-12"><ui-progress-bar .percent=${40}></ui-progress-bar></p>
        </div>
      </div>
      <!-- Switch -->
      <div name="Switch" class="doc-intro">
        <p class="flex gap-1 items-center">
          <ui-input-switch :checked="inputSwitch" @change="${(e) => (this.inputSwitch = e.detail)}"></ui-input-switch>
          ${this.inputSwitch}
        </p>
      </div>
      <!-- Text -->
      <div name="Text" class="doc-intro">
        <!-- Full TextField -->
        <div class="flex gap-8 items-center">
          <ui-input-text
            @input=${this.onInputCode}
            value=${this.inputText}
            placeholder="Enter your album name"
            required
            ?disabled=${this.txPending}
          >
            <span slot="label">Album Name</span>
            <span slot="tip">
              <ui-link href="/help">How to?</ui-link>
            </span>
            <span slot="right" class="-mr-1">
              <ui-button @click="()=>{}" icon sm class="text-blue-500"
                ><i class="mdi mdi-magnify text-lg"></i
              ></ui-button>
            </span>
            <span slot="msg">
              ${when(this.inputTextErr, () => html`<span class="text-red-500">${this.inputTextErr}</span>`)}
            </span>
          </ui-input-text>
          <span>Your code is: ${when(!this.inputTextErr, () => html`<b>${this.inputText}</b>`)}</span>
        </div>
        <!-- Simple TextField -->
        <div class="flex flex-col gap-4 w-72">
          <ui-input-text
            sm
            @input=${this.onInputCode}
            value=${this.inputText}
            placeholder="Enter your album name"
            required
            ?disabled=${this.txPending}
          >
            <span slot="right">
              <i class="mdi mdi-account-outline"></i>
            </span>
          </ui-input-text>
          <!-- Simple Password -->
          <ui-input-pwd
            sm
            value=${this.inputPwd}
            placeholder="Enter your password"
            required
            ?disabled=${this.txPending}
          >
          </ui-input-pwd>
        </div>
      </div>
      <!-- Tip -->
      <div name="Tip" class="doc-intro">
        <ui-tip>Hello world</ui-tip>
      </div>
      <!-- Image Loader -->
      <div name="Image Loader" class="doc-intro">
        <p class="w-24">
          <img-loader
            src="https://upload.wikimedia.org/wikipedia/en/1/18/Black_hole_Interstellar.png"
            loading="lazy"
          ></img-loader>
        </p>
      </div>
      <!-- Menu -->
      <div name="Menu" class="doc-intro">
        <ui-drop
          .show=${this.menu}
          @change=${(e: CustomEvent) => (this.menu = e.detail)}
          btnText
          btnDense
          icon
          align="left"
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
      <!-- Loading -->
      <div name="Loading" class="doc-intro">
        <div class="flex gap-4">
          <loading-icon></loading-icon>
          <loading-skeleton num="3"></loading-skeleton>
        </div>
      </div>
      <!-- Pagination -->
      <div name="Pagination" class="doc-intro">
        <ui-pagination mode="click" .firstLoad=${false} .pending=${this.pagePending} @loadmore=${this.pageLoad}
          ><span slot="empty">No data yet.</span>
        </ui-pagination>
      </div>
    </div>`
  }
}
