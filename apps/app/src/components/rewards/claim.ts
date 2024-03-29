import { ThemeElement, customElement, html, state, when } from '@riffian-web/ui/shared/theme-element'
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
import { weekStatistic, weeklyReward } from './action'
import { formatUnits } from 'ethers'
import { weeklyStore } from '~/store/weekly'
// Components
import '@riffian-web/ui/button'
import './dialog'

import style from './claim.css?inline'
@customElement('claim-rewards')
export class ClaimRewards extends ThemeElement(style) {
  bindWallet: any = new StateController(this, walletStore)
  bindWeekly: any = new StateController(this, weeklyStore)

  @state() rewards = 0n
  @state() pending = true
  @state() dialog = false

  get disabled() {
    return !walletStore.account
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.weeklyRewards()
  }

  weeklyRewards = async () => {
    try {
      this.pending = true
      try {
        this.rewards = await weeklyReward()
      } catch (e) {
        let week = await weekStatistic(await weeklyStore.getLatest())
        this.rewards = (BigInt(week.weeklyStatistic?.volumeVote ?? 0) * 4n) / 100n
      }
    } catch (err: any) {
      console.error('claim', err)
    } finally {
      this.pending = false
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
                  <span class="ui-em text-xl">${formatUnits(this.rewards)}</span></span
                >`
          )}
        </div>
        ${when(this.dialog, () => html`<claim-reward-dialog @close=${this.close}></claim-reward-dialog>`)}
      </div>
    `
  }
}
