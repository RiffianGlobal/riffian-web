import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { getContract } from '@riffian-web/ethers/src/useBridge'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/dialog'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'

@customElement('new-album')
export class NewAlbum extends TailwindElement('') {
  @property({ type: String }) type = 'inline'
  @property({ type: String }) name = null
  @property({ type: String }) symbol = null
  @state() dialog = false
  bindBridge: any = new StateController(this, bridgeStore)

  handleInput(event: Event) {
    let { id, value } = event.target
    this[id] = value
  }

  async createAlbum() {
    if (!this.name || !this.symbol) {
      alert('Name or Symbol should not be blank!')
      return
    }
    if (!bridgeStore.bridge.account) {
      alert('Connect wallet first!')
      return
    }
    try {
      const overrides = {} as any
      const contract = await getContract('MediaBoard', { abiName: 'MediaBoard' })
      const txn = await contract.newAlbum(this.name, this.symbol)
      await txn.wait()
      alert('Create Success, please visit scan for details. txn hash: ' + txn.hash)
    } catch (err) {
      alert(err)
    }
    // return new txReceipt(txn, {
    //   seq: {
    //     type: 'approve',
    //     title: `NewAlbum`,
    //     ts: new Date().getTime(),
    //     overrides
    //   }
    // })
  }

  render() {
    return html`<ui-button sm @click=${() => (this.dialog = true)}>New Album</ui-button> ${when(
        this.dialog,
        () =>
          html`<ui-dialog @close=${() => (this.dialog = false)}>
            <input
              id="name"
              name="name"
              type="text"
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              placeholder="Input Name"
              @change=${this.handleInput}
              required
            />
            <input
              type="text"
              id="symbol"
              name="symbol"
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mt-2"
              placeholder="Input Symbol"
              @change=${this.handleInput}
              required
            />
            <ui-button sm @click=${this.createAlbum}> SUBMIT </ui-button>
          </ui-dialog>`
      )}`
  }
}
