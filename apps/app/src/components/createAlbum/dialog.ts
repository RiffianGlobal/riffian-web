import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { createAlbum } from './action'
// Components
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/tx-state'

type formKeys = 'album' | 'image' | 'url'

const defFrom = () => ({ album: '', image: '', url: '' })
const defErr = () => ({ album: '', image: '', tx: '' })

@customElement('create-album-dialog')
export class CreateAlbumDialog extends TailwindElement('') {
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
      if (err.code === 'ACTION_REJECTED') {
        this.updateErr({ tx: msg })
        return this.close()
      }
    } finally {
      this.pending = false
    }
  }

  render() {
    return html`<ui-dialog @close=${this.close}>
      <p slot="header" class="my-2 font-bold">New Album</p>
      <div class="flex flex-col w-full m-4 gap-4 mx-auto">
        <!-- Tx pending -->
        ${when(
          this.txPending,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your album has been created.' } }}
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
              placeholder="Your album name"
              required
              autofocus
            >
              <span slot="label">Album Name</span>
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
            <p class="text-center">${this.form.album || '-'}<span class="mx-1">/</span>${this.form.image || '-'}</p>
            <ui-button class="mx-auto" @click=${this.create} ?disabled="${this.pending}">Confirm</ui-button>
          `
        )}
      </div>
    </ui-dialog>`
  }
}
