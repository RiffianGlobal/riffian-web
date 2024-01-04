import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { createAlbum } from './action'
// Components
import '@riffian-web/ui/button'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/tx-state'
import '@riffian-web/ui/img/loader'

type formKeys = 'album' | 'image' | 'url'

const defFrom = () => ({ album: '', image: '', url: '' })
const defErr = () => ({ album: '', image: '', tx: '' })

@customElement('create-album-dialog')
export class CreateAlbumDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() album = ''
  @state() image = ''
  @state() form = defFrom()
  @state() err = defErr()
  @state() pending = false
  @state() success = false
  @state() tx: any = null

  get invalid() {
    return !this.form.album || !this.form.image
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
    this.form = defFrom()
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

  render() {
    return html`<ui-dialog @close=${this.close}>
      <p slot="header" class="my-2 font-bold">New Track</p>
      <div class="flex flex-col w-full m-4 gap-4 mx-auto">
        <!-- Tx pending -->
        ${when(
          this.txPending,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your track has been created.' } }}
              ><ui-button slot="view" href="/">Close</ui-button></tx-state
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
            >
              <span slot="label">Track Name</span>
            </ui-input-text>
            <!-- Symbol -->
            <ui-input-text
              value=${this.form.image}
              @input=${(e: CustomEvent) => this.onInput(e, 'image')}
              placeholder="Your image URL"
              required
            >
              <span slot="label">Image</span>
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

            <div class="self-center w-[4.6rem] h-[4.6rem]">
              <img-loader
                .src=${this.form.image ||
                'https://cdn.shopify.com/app-store/listing_images/a82167e02b45cadf681efc6c17c35f3a/icon/CMmMjb30lu8CEAE=.jpg'}
              ></img-loader>
            </div>
            <p class="text-center">${this.form.album || '-'}</p>
            <ui-button class="mx-auto" @click=${this.create} ?disabled="${this.pending}">Confirm</ui-button>
          `
        )}
      </div>
    </ui-dialog>`
  }
}
