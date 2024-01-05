import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { claimRewards, userWeeklyReward } from './action'
import { formatUnits } from 'ethers'

import '@riffian-web/ui/button'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/tx-state'

const defErr = () => ({ load: '', tx: '' })
@customElement('claim-reward-dialog')
export class ClaimRewardDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() userWeeklyReward = -1
  @state() tx: any = null
  @state() success = false
  @state() pending = false
  @state() pendingTx = false
  @state() rewards = false
  @state() err = defErr()
  @state() ts = 0

  get bridge() {
    return bridgeStore.bridge
  }
  get emptyRewards() {
    return this.ts && !(this.userWeeklyReward > 0)
  }

  connectedCallback() {
    super.connectedCallback()
    this.getPrice()
  }

  async getPrice() {
    // if (bridgeStore.notReady) return
    this.pending = true
    try {
      this.userWeeklyReward = await userWeeklyReward(bridgeStore.bridge.account as string)
    } catch (err: any) {
      let msg = err.message || err.code
      this.updateErr({ load: msg })
    } finally {
      this.ts++
      this.pending = false
    }
  }

  async claim() {
    this.pendingTx = true
    try {
      this.tx = await claimRewards()
      this.success = await this.tx.wait()
    } catch (err: any) {
      console.log(err)
      let msg = err.message || err.code
      if (err.code === 4001 || err.code === 'INVALID_ARGUMENT') {
        this.updateErr({ tx: msg })
        return this.close()
      }
      if (/(Week not past)/.test(msg)) {
        this.updateErr({ tx: `Week is not past, please try later.` })
      }
    } finally {
      this.pendingTx = false
    }
  }
  resetState = () => {
    this.err = defErr()
    this.pending = false
    this.pendingTx = false
    this.success = false
    this.userWeeklyReward = -1
    this.ts = 0
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
      <!-- header -->
      <p slot="header" class="w-full mr-2 text-base">Claim Rewards</p>
      <!-- content -->
      <div class="w-full h-[5.6rem] flex flex-col justify-center items-center self-center">
        ${when(
          this.emptyRewards,
          // no rewards
          () => html`No rewards to claim yet.`,
          () => html`
            ${when(
              this.pending,
              // loading
              () => html`
                <div class="my-4">
                  <loading-icon></loading-icon>
                </div>
              `,
              // rewards info
              () =>
                html`${when(
                  this.pendingTx,
                  () =>
                    html`<tx-state
                      .tx=${this.tx}
                      .opts=${{ state: { success: 'Success. Your claim request has been submitted.' } }}
                    >
                    </tx-state>`,
                  () =>
                    html`<div class="text-base inline-flex items-center">
                        <span class="text-2xl text-yellow-500 mr-2">${formatUnits(this.userWeeklyReward, 18)}</span>
                        rewards to claim.
                      </div>
                      ${when(
                        this.err.tx,
                        () => html`<div class="mt-1.5 text-red-500 text-sm opacity-70">${this.err.tx}</div>`
                      )}`
                )}`
            )}
          `
        )}
      </div>
      <!-- foot -->
      <div slot="bottom">
        ${when(
          this.ts && !this.emptyRewards,
          // have rewards
          () =>
            html`<div
              class="flex justify-center items-center mx-4 py-4 border-t border-transparent"
              style="border-color: rgba(255, 255, 255, .12)"
            >
              <ui-button ?disabled=${this.pendingTx} ?pending=${this.pendingTx} @click=${this.claim}
                >Claim<i class="mdi ${this.pending ? 'mdi-loading' : ''}"></i
              ></ui-button>
            </div>`
        )}
      </div>
    </ui-dialog>`
  }
}
