import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { getContract } from '@riffian-web/ethers/src/useBridge'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/dialog'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'

@customElement('new-album')
export class NewAlbum extends TailwindElement('') {
  @property({ type: Boolean }) submit = false
  @property({ type: String }) result = ''
  @property({ type: Boolean }) err = false
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
    this.submit = true
    if (!this.name || !this.symbol) {
      this.result = 'Name or Symbol should not be blank!'
      this.err = true
      console.log(this.result)
      return
    }
    if (!bridgeStore.bridge.account) {
      this.result = 'Connect wallet first!'
      this.err = true
      return
    }
    try {
      const overrides = {} as any
      const contract = await getContract('MediaBoard', { abiName: 'MediaBoard' })
      const txn = await contract.newAlbum(this.name, this.symbol)
      await txn.wait()
      this.result = 'Create Success, please visit scan for details. txn hash: ' + txn.hash
      this.err = false
    } catch (e) {
      alert(e)
      this.result = e.message
      this.err = true
    }
  }

  render() {
    return html` <div class="grid place-items-center b-1">
      <p class="my-2 font-bold">New Album</p>
      ${when(
        !this.submit,
        () =>
          html` <input
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
            <ui-button class="m-1" sm @click=${this.createAlbum}> SUBMIT </ui-button>`
      )}
      ${when(
        this.submit && !this.result,
        () =>
          html` <i class="text-5xl mdi mdi-loading"></i>
            <p>Submiting txn to Fantom Network...</p>`
      )}
      ${when(
        this.submit && this.result,
        () =>
          html` ${when(this.err, () => html`<p style="color:red">${this.result}</p>`)}
            ${when(!this.err, () => html`<p>${this.result}</p>`)}
            <ui-button
              class="mt-2"
              sm
              @click=${() => {
                this.submit = false
                this.err = false
              }}
            >
              Return
            </ui-button>`
      )}
    </div>`
  }
}
