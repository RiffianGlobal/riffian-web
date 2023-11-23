import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { createAlbum } from './action'
// Components
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/tx-state'

type formKeys = 'album' | 'symbol'

const defFrom = () => ({ album: '', symbol: '' })
const defErr = () => ({ album: '', symbol: '', tx: '' })

@customElement('create-album-dialog')
export class CreateAlbumDialog extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() album = ''
  @state() symbol = ''
  @state() form = defFrom()
  @state() err = defErr()
  @state() pending = false
  @state() success = false
  @state() tx: any = null

  get invalid() {
    return !this.form.album || !this.form.symbol
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
      this.tx = await createAlbum(this.form.album, this.form.symbol)
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
            <p class="my-2 font-bold text-center">New Album</p>
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
              value=${this.form.symbol}
              @input=${(e: CustomEvent) => this.onInput(e, 'symbol')}
              placeholder="Your symbol"
              required
            >
              <span slot="label">Symbol</span>
            </ui-input-text>
            <!-- Preview -->
            <p class="text-center">${this.form.album || '-'}<span class="mx-1">/</span>${this.form.symbol || '-'}</p>
            <ui-button class="mx-auto" @click=${this.create} ?disabled="${this.pending}">Confirm</ui-button>
          `
        )}
      </div>
    </ui-dialog>`
  }
}
