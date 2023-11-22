import {
  TailwindElement,
  customElement,
  html,
  property,
  state,
  when,
  queryAll
} from '@riffian-web/ui/src/shared/TailwindElement'
import { getContract } from '@riffian-web/ethers/src/useBridge'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/dialog'
import '@riffian-web/ui/src/input/text'

@customElement('new-album')
export class NewAlbum extends TailwindElement('') {
  @property({ type: Boolean }) submit = false
  @property({ type: String }) result = ''
  @property({ type: Boolean }) err = false
  @property({ type: String }) type = 'inline'
  @property({ type: String }) name = null
  @property({ type: String }) symbol = null
  @state() dialog = false
  @queryAll('ui-input-text')
  _inputs!: HTMLInputElement

  bindBridge: any = new StateController(this, bridgeStore)

  async createAlbum() {
    Array.prototype.forEach.call(this._inputs, (node) => {
      if (node.id == 'name') {
        this.name = node.value
      }
      if (node.id == 'symbol') {
        this.symbol = node.value
      }
    })
    console.log(this.name + ',' + this.symbol)
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
      // const overrides = {} as any
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
          html` <div>
              <ui-input-text id="name" name="name" type="text" placeholder="Input Name" required />
            </div>
            <div>
              <ui-input-text type="text" id="symbol" name="symbol" placeholder="Input Symbol" required />
            </div>
            <ui-button class="m-1" @click=${this.createAlbum}> SUBMIT </ui-button>`
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
