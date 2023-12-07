import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { claimRewards, userWeeklyReward } from './action'
import { formatUnits } from 'ethers'

import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/tx-state'

const defErr = () => ({ tx: '' })
@customElement('claim-reward-dialog')
export class ClaimRewardDialog extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() userWeeklyReward = -1
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
      this.userWeeklyReward = await userWeeklyReward(bridgeStore.bridge.account)
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ tx: msg })
    } finally {
    }
  }

  async claim() {
    this.pending = true
    try {
      this.tx = await claimRewards()
      this.success = await this.tx.wait()
    } catch (err: any) {
      console.log(err)
      let msg = err.message || err.code
      if (err.code === 'ACTION_REJECTED' || err.code === 'INVALID_ARGUMENT') {
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
    this.userWeeklyReward = 0
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
      <p slot="header" class="my-2 font-bold">Claim Rewards</p>
      <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
        ${when(
          !(this.userWeeklyReward >= 0),
          () =>
            html`<div class="my-4">
              <loading-icon></loading-icon>
            </div>`
        )}
        ${when(
          this.userWeeklyReward >= 0 && !this.pending,
          () => html`
            <p class="font-bold">Reward Value</p>
            <p class="text-xl text-sky-500">${formatUnits(this.userWeeklyReward, 18)} FTM</p>
            <ui-button ?disabled="${this.userWeeklyReward <= 0}" class="m-1" @click=${this.claim}> CLAIM </ui-button>
          `
        )}${when(
          this.pending,
          () =>
            html`<tx-state
              .tx=${this.tx}
              .opts=${{ state: { success: 'Success. Your claim request has been submit.' } }}
              ><ui-button slot="view" href="/">Close</ui-button></tx-state
            >`
        )}
      </div>
    </ui-dialog>`
  }
}
