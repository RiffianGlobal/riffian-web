import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController, getAccount } from '@riffian-web/ethers/src/useBridge'
import { retreatPrice, userSubjectVotes, retreat } from './action'
import { formatUnits } from 'ethers'

import '@riffian-web/ui/button'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/tx-state'

const defErr = () => ({ tx: '' })
@customElement('retreat-vote-dialog')
export class VoteAlbumDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: String }) album = ''
  @property({ type: String }) url = ''
  @property({ type: Number }) votes = 0
  @state() price = 0
  @state() tx: any = null
  @state() success = false
  @state() pending = false
  @state() rewards = false
  @state() err = defErr()

  connectedCallback() {
    super.connectedCallback()
    this.getPrice()
  }

  async getPrice() {
    try {
      let result = await userSubjectVotes(this.album, await getAccount())
      this.votes = result
      this.price = await retreatPrice(this.album, this.votes)
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ tx: msg })
    }
  }

  async retreat() {
    this.pending = true
    try {
      this.tx = await retreat(this.album, this.votes)
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

  resetState = () => {
    this.err = defErr()
    this.pending = false
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
      <p slot="header" class="my-2 font-bold">Retreat Subject</p>
      <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
        <p class="w-36 h-36"><img-loader src=${this.url}></img-loader></p>

        ${when(
          !this.price,
          () =>
            html`<div class="my-4">
              <loading-skeleton num="3"></loading-skeleton>
              <p class="my-4">Loading subject data...</p>
            </div>`
        )}
        ${when(
          this.price && !this.pending,
          () => html`
            <p class="font-bold">Estimated returned value</p>
            <p class="text-xl text-sky-500">${formatUnits(this.price, 18)} FTM</p>
            <p>Your Votes:${this.votes}</p>
            <ui-button class="m-1" @click=${this.retreat}> RETREAT </ui-button>
          `
        )}${when(
          this.pending,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your retreat has been submitted.' } }}
              ><ui-button slot="view" href="/"> Close </ui-button></tx-state
            >`
        )}
      </div>
    </ui-dialog>`
  }
}
