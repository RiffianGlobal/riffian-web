import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { vote, albumData, votePrice } from './action'

import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/tx-state'

const defErr = () => ({ tx: '' })
@customElement('vote-album-dialog')
export class VoteAlbumDialog extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: String }) album = ''
  @property({ type: String }) url = ''
  @property({ type: Number }) votes = 0
  @state() price = 0
  @state() tx: any = null
  @state() success = false
  @state() voting = false
  @state() err = defErr()

  connectedCallback() {
    super.connectedCallback()
    this.getPrice()
  }

  async getPrice() {
    try {
      let result = await albumData(this.album)
      this.votes = result[1]
      this.price = await votePrice(this.album, Number(this.votes) + 1)
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ tx: msg })
    }
  }

  async vote() {
    this.voting = true
    try {
      this.tx = await vote(this.album, { value: this.price })
      this.success = await this.tx.wait()
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 'ACTION_REJECTED') {
        this.updateErr({ tx: msg })
        return this.close()
      }
    } finally {
      // this.voting = false
    }
  }
  resetState = () => {
    this.err = defErr()
    this.voting = false
    this.success = false
    this.price = 0
  }
  close = async () => {
    this.tx = null
    this.resetState()
    this.emit('close')
  }

  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))

  render() {
    return html`<ui-dialog
      @close=${() => {
        this.close()
      }}
    >
      <p class="my-2 font-bold">VOTE Album</p>
      <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
        <img class="w-36 h-36" src=${this.url} />

        ${when(
          !this.price,
          () =>
            html`<i class="text-5xl mdi mdi-loading"></i>
              <p>Loading vote price...</p>`
        )}${when(
          this.price && !this.voting,
          () => html`
            <p>Estimated cost</p>
            <p class="text-5xl text-sky-500">${Number(this.price) / Math.pow(10, 18)} FTM</p>
            <p>Current Votes:${this.votes}</p>
            <ui-button class="m-1" @click=${this.vote}> VOTE THIS! </ui-button>
          `
        )}${when(
          this.voting,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your vote has been submit.' } }}
              ><ui-button slot="view" href="/">Close</ui-button></tx-state
            >`
        )}
      </div>
    </ui-dialog>`
  }
}
