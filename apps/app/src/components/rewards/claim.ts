import { ThemeElement, customElement, html, state, when } from '@riffian-web/ui/shared/theme-element'
import { asyncReplace } from 'lit/directives/async-replace.js'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { getWeek, weekStatistic, weeklyReward } from './action'
import { formatUnits } from 'ethers'
import { weeklyStore } from '~/store/weekly'
// Components
import '@riffian-web/ui/button'
import './dialog'

import style from './claim.css?inline'
@customElement('claim-rewards')
export class ClaimRewards extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindWeekly: any = new StateController(this, weeklyStore)

  @state() rewards = 0n
  @state() pending = true
  @state() dialog = false

  get disabled() {
    return !bridgeStore.bridge.account
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.weeklyRewards()
  }

  async weeklyRewards() {
    try {
      this.pending = true
      try {
        this.rewards = await weeklyReward()
      } catch (e) {
        let week = await weekStatistic(await weeklyStore.getLatest())
        this.rewards = (BigInt(week.weeklyStatistic?.volumeVote ?? 0) * 4n) / 100n
      }
      this.pending = false
    } catch (err: any) {
      console.error('claim', err)
    }
  }

  open = () => (this.dialog = true)
  close = () => (this.dialog = false)

  render() {
    return html`
      <div class="text-right font-light">
        <div class="">
          ${when(
            this.pending,
            () => html`<i class="text-lg mdi mdi-loading"></i>`,
            () =>
              html`<ui-button icon sm @click="${this.open}" ?disabled="${this.disabled}" title="Claim"
                  ><i class="mdi mdi-hand-coin-outline"></i></ui-button
                ><span class="">
                  <span class="text-base text-gray-300">Pool: </span>
                  <span class="ui-em text-xl">${formatUnits(this.rewards, 18)}</span></span
                >`
          )}
        </div>
        ${when(this.dialog, () => html`<claim-reward-dialog @close=${this.close}></claim-reward-dialog>`)}
      </div>
    `
  }
}
