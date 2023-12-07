import {
  TailwindElement,
  customElement,
  html,
  property,
  state,
  until,
  when
} from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { vote, albumData, votePrice, votePriceWithFee, myVotes } from './action'
import { formatUnits } from 'ethers'

import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/tx-state'

const defErr = () => ({ tx: '' })
@customElement('vote-album-dialog')
export class VoteAlbumDialog extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: String }) album = ''
  @property({ type: String }) url = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() price: Promise<any> | undefined
  @state() myVotes: Promise<any> | undefined
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
      this.votes = albumData(this.album).then((result) => result[4])
      this.price = votePrice(this.album).then((price) => formatUnits(price, 18))
      this.myVotes = myVotes(this.album)
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ tx: msg })
    }
  }

  async vote() {
    this.pending = true
    try {
      this.tx = await vote(this.album, 1, { value: (await votePriceWithFee(this.album))[0] })
      this.success = await this.tx.wait()
    } catch (err: any) {
      console.log(err)
      let msg = err.message || err.code
      if (err.code === 'ACTION_REJECTED' || err.code === 'INVALID_ARGUMENT') {
        this.updateErr({ tx: msg })
        this.pending = false
        // return this.close()
      }
    } finally {
      // this.pending = false
    }
  }
  resetState = () => {
    this.err = defErr()
    this.pending = false
    this.success = false
    this.price = undefined
    this.votes = undefined
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
      <p slot="header" class="my-2 font-bold">VOTE Track</p>
      <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
        <p class="w-36 h-36"><img-loader src=${this.url}></img-loader></p>
        ${when(
          !this.pending,
          () => html`
            <p>
              Vote Price:
              <span class="text-xl text-sky-500"
                >${until(this.price, html`<i class="text-sm mdi mdi-loading"></i>`)} FTM</span
              >
            </p>
            <p>Current Votes: ${until(this.votes, html`<i class="text-sm mdi mdi-loading"></i>`)}</p>
            <p>My Votes: ${until(this.myVotes, html`<i class="text-sm mdi mdi-loading"></i>`)}</p>
            <ui-button class="m-1" @click=${this.vote}> VOTE THIS! </ui-button>
          `,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your vote has been submit.' } }}
              ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
            >`
        )}
      </div>
    </ui-dialog>`
  }
}
