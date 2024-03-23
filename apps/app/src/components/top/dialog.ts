import { ThemeElement, customElement, html, property, state, until, when } from '@riffian-web/ui/shared/theme-element'
import emitter from '@lit-web3/base/emitter'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { vote, votePriceWithFee, myVotes, retreatPrice, retreat } from './action'
import { formatUnits } from 'ethers'
import { tweetStore, type Social } from '~/store/tweet'
import { balanceStore } from '~/store/balance'
// Components
import '@riffian-web/ui/button'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/tx-state'

const defErr = () => ({ tx: '' })
@customElement('vote-album-dialog')
export class VoteAlbumDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  bindTweets: any = new StateController(this, tweetStore)
  bindBalance: any = new StateController(this, balanceStore)
  @property({ type: String }) action = ''
  @property({ type: String }) album = ''
  @property({ type: String }) url = ''
  @property({ type: String }) name = ''
  @property({ type: String }) author = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: any = 0
  @state() votePrice: any = 0
  @state() voteFee: any = 0
  @state() retreatPrice: any = 0
  @state() social: Social | undefined
  @state() tx: any = null
  @state() success = false
  @state() pending = false
  @state() rewards = false
  @state() err = defErr()
  @state() ts = 0

  async connectedCallback() {
    super.connectedCallback()
    await this.getPrice()
    await this.readFromTwitter()
  }

  get hasVoted() {
    return this.ts && +formatUnits(this.myVotes, 1) > 0
  }
  get insufficientBalance() {
    if (balanceStore.inited && +balanceStore.balance == 0) return true
    if (this.ts && +balanceStore.balance < +this.votePrice) return true
    return false
  }
  get btnDisabled() {
    return this.pending || this.insufficientBalance
  }

  async readFromTwitter() {
    this.social = await tweetStore.fromAddress(this.author)
  }

  async getPrice() {
    try {
      const [[voteSum, votePri], retreatPri, votes] = await Promise.all([
        votePriceWithFee(this.album),
        retreatPrice(this.album),
        myVotes(this.album)
      ])

      this.votePrice = formatUnits(voteSum)
      this.voteFee = formatUnits(voteSum - votePri).toString()
      this.retreatPrice = formatUnits(retreatPri)
      this.myVotes = votes
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ tx: msg })
    }
    this.ts++
  }

  async vote() {
    this.pending = true
    try {
      this.tx = await vote(this.album, 1, { value: (await votePriceWithFee(this.album))[0] })
      this.success = await this.tx.wait()
      this.emitChange()
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) {
        this.updateErr({ tx: msg })
        return this.close()
      }
      if (!this.tx) {
        this.tx = {}
        this.tx.status = 0
        this.tx.err = err
      }
    }
  }

  async retreat() {
    this.pending = true
    try {
      this.tx = await retreat(this.album, 1)
      this.success = await this.tx.wait()
      await this.emitChange()
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) {
        this.updateErr({ tx: msg })
        return this.close()
      }
      if (!this.tx) {
        this.tx = {}
        this.tx.status = 0
        this.tx.err = err
      }
    }
  }

  resetState = () => {
    this.err = defErr()
    this.pending = false
    this.success = false
    this.votePrice = 0
    this.retreatPrice = 0
    this.votes = undefined
  }
  emitChange = () => {
    this.emit('change')
  }
  close = async () => {
    this.tx = null
    this.resetState()
    this.emit('close')
  }
  go = (dest = '') => {
    this.close()
    if (dest === 'rewards') emitter.emit('reward-show')
  }

  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))

  render() {
    return html`<ui-dialog
      @close=${() => {
        this.close()
      }}
    >
      <p slot="header" class="w-full text-base mr-2">Vote</p>
      <div slot="center" class="flex mx-4 my-6">
        <div class="flex grow justify-between p-4 border border-white/15 rounded-xl">
          <!-- meta info -->
          <div class="flex gap-3 md_gap-6">
            <div class="w-20 h-20 md_w-24 md_h-24 rounded-lg bg-white/10">
              <img-loader class="w-20 h-20  md_w-24 md_h-24 rounded-lg" src=${this.url}></img-loader>
            </div>
            <div>
              <div class="text-lg mb-1.5">${this.name}</div>
              <div class="text-sm">${this.social?.name}</div>
              ${when(
                this.social?.id,
                () => html`
                  <a class="text-sm text-blue-300" href="${this.social?.url}" target="_blank">@${this.social?.id}</a>
                `,
                () => html`-`
              )}

              <div class="text-neutral-400">
                You own
                ${when(
                  this.ts,
                  () => html`${formatUnits(this.myVotes, 0)}`,
                  () => html`<i class="text-sm mdi mdi-loading"></i>`
                )}
                tickets
              </div>
            </div>
          </div>
          <!-- Tickets -->
          <div class="flex flex-col justify-center items-center">
            <span class="text-xl font-medium">${until(this.votes, html`<i class="text-sm mdi mdi-loading"></i>`)}</span>
            <div class="text-sm text-gray-500">Tickets</div>
          </div>
        </div>
        <!-- tip -->
      </div>
      <div slot="bottom" class="mx-4 pb-8">
        <p class="w-full flex justify-between items-center">
          Price
          <span class="text-right"
            ><span class="text-sm text-gray-500">Vote price <i class="text-sm mdi mdi-help-circle-outline"></i></span
          ></span>
        </p>
        <div class="mt-8">
          ${when(
            !this.pending,
            () => html`
              ${when(
                this.ts && this.action === 'vote',
                () => html`
                  <div class="flex flex-col justify-center items-center px-4">
                    <div class="flex flex-col justify-center items-center">
                      ${when(
                        this.votePrice > 0,
                        () =>
                          html`<span class="text-3xl text-yellow-500">${this.votePrice}</span>
                            <span class="opacity-80 ml-2">(${this.voteFee} fee included)</span>`,
                        () => html`<i class="text-sm mdi mdi-loading"></i>`
                      )}
                    </div>
                    <ui-button
                      class="mt-3 min-w-36 w-full md_w-40"
                      ?disabled=${this.btnDisabled}
                      ?pending=${this.pending}
                      @click=${this.vote}
                      >${this.insufficientBalance ? 'Insufficient Balance' : 'Vote'}</ui-button
                    >
                    <p class="mt-4">
                      Please get <ui-link @click=${() => this.go('rewards')}>rewards first</ui-link> or
                      <ui-link href="/profile">retreat tickets</ui-link> and try again.
                    </p>
                  </div>
                `
              )}
              ${when(
                this.ts && this.hasVoted && this.action === 'retreat',
                () => html`
                  <div class="flex flex-col justify-center items-center px-4 border-white/12">
                    <div class="text-3xl text-yellow-500">
                      ${until(this.retreatPrice, html`<i class="text-sm mdi mdi-loading"></i>`)}
                    </div>

                    <ui-button
                      class="mt-3 w-full md_w-36"
                      ?disabled=${this.btnDisabled}
                      ?pending=${this.pending}
                      @click=${this.retreat}
                      >${this.insufficientBalance ? 'Insufficient Balance' : 'Retreat'}</ui-button
                    >
                  </div>
                `
              )}
            `,
            () =>
              html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Your vote has been submitted.' } }}
                ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
              >`
          )}
        </div>
      </div>
    </ui-dialog>`
  }
}
