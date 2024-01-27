import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { createAlbum } from './action'
import emitter from '@lit-web3/base/emitter'
// Components
import '@riffian-web/ui/button'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/tx-state'
import '@riffian-web/ui/img/loader'

type formKeys = 'album' | 'image' | 'url'

const defForm = () => ({ album: '', image: '', url: '' })
const defErr = () => ({ album: '', image: '', tx: '' })

@customElement('create-album-dialog')
export class CreateAlbumDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() album = ''
  @state() image = ''
  @state() form = defForm()
  @state() err = defErr()
  @state() pending = false
  @state() success = false
  @state() tx: any = null

  get invalid() {
    return !this.form.album || !this.form.image || !this.form.url || ['album', 'image'].some((k) => !!this.err[k])
  }
  get txPending() {
    return this.tx && !this.tx.ignored
  }

  updateForm = (form = {}) => (this.form = Object.assign({}, this.form, form))
  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))

  async onInput(e: CustomEvent, key: formKeys) {
    this.updateForm({ [key]: e.detail })
    this.updateErr({ [key]: '', tx: '' })
    if (this.form[key].length < 4) {
      this.updateErr({ [key]: 'Invalid input' })
    }
  }

  resetState = () => {
    this.form = defForm()
    this.err = defErr()
    this.pending = false
    this.success = false
  }
  close = async () => {
    this.tx = null
    this.resetState()
    this.emit('close')
  }

  async create() {
    this.pending = true
    try {
      this.tx = await createAlbum(this.form.album, this.form.image, this.form.url)
      this.success = await this.tx.wait()
      emitter.emit('manual-change')
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) {
        this.updateErr({ tx: msg })
        return this.close()
      }
    } finally {
      this.pending = false
    }
  }
  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<ui-dialog @close=${this.close}>
      <p slot="header" class="w-full text-base mr-2">New Track</p>

      <div class="flex flex-col w-full m-4 gap-4 mx-auto">
        <!-- Tx pending -->
        ${when(
          this.txPending,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your track has been created.' } }}
              ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
            >`
        )}
        <!-- Form -->
        ${when(
          !this.txPending,
          () => html`
            <!-- Album -->
            <ui-input-text
              value=${this.form.album}
              @input=${(e: CustomEvent) => this.onInput(e, 'album')}
              placeholder="Your track name"
              required
              autofocus
              err=${this.err.album}
            >
              <span slot="label">Track Name</span>
              ${when(this.err.album, () => html`<span slot="msg" class="text-red-400">${this.err.album}</span>`)}
            </ui-input-text>
            <!-- Symbol -->
            <ui-input-text
              value=${this.form.image}
              @input=${(e: CustomEvent) => this.onInput(e, 'image')}
              placeholder="Your image URL"
              err=${this.err.image}
              required
            >
              <span slot="label">Image</span>
              ${when(this.err.image, () => html`<span slot="msg" class="text-red-400">${this.err.image}</span>`)}
            </ui-input-text>
            <ui-input-text
              value=${this.form.url}
              @input=${(e: CustomEvent) => this.onInput(e, 'url')}
              placeholder="Your resource URL"
              required
            >
              <span slot="label">URL</span>
            </ui-input-text>
            <!-- Preview -->
            <p class="text-base">Preview</p>
            <div class="mb-4 p-4 flex gap-4 border border-white/20 rounded-lg">
              <div class="self-center w-[3.75rem] h-[3.75rem] rounded-lg">
                <img-loader
                  class="w-[3.75rem] h-[3.75rem] rounded-lg"
                  .src=${!this.invalid.image
                    ? this.form.image
                    : 'https://cdn.shopify.com/app-store/listing_images/a82167e02b45cadf681efc6c17c35f3a/icon/CMmMjb30lu8CEAE=.jpg'}
                ></img-loader>
              </div>
              <div>
                <p class="text-lg">${!this.err.album ? this.form.album : '-'}</p>
                ${when(
                  this.form.url,
                  () => html`<span class="icon"><i class="mdi mdi-play-circle-outline"></i></span>`
                )}
              </div>
            </div>
            <ui-button
              class="mx-auto"
              @click=${this.create}
              ?disabled="${this.invalid || this.pending}"
              ?pending=${this.pending}
              >Confirm</ui-button
            >
          `
        )}
      </div>
      <div slot="bottom"></div>
    </ui-dialog>`
  }
}
