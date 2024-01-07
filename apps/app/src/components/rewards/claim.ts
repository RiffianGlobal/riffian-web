import { ThemeElement, customElement, html, state, when } from '@riffian-web/ui/shared/theme-element'
import { asyncReplace } from 'lit/directives/async-replace.js'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { getWeek, weekStatistic, weeklyReward } from './action'
import { formatUnits } from 'ethers'
// Components
import '@riffian-web/ui/button'
import './dialog'

import style from './claim.css?inline'
@customElement('claim-rewards')
export class ClaimRewards extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)

  @state() rewards = 0n
  @state() pending = true
  @state() dialog = false

  get disabled() {
    return !bridgeStore.bridge.account
  }

  timeCountDown = async function* () {
    const weekSeconds = 7n * 24n * 60n * 60n
    let weekBegin = await getWeek(),
      timeLeft = 0n
    do {
      let tsNow = BigInt(new Date().getTime()) / 1000n
      timeLeft = weekBegin + weekSeconds - tsNow
      let days = timeLeft / 86400n,
        hours = (timeLeft - days * 86400n) / 3600n,
        minutes = (timeLeft - days * 86400n - hours * 3600n) / 60n,
        seconds = timeLeft - days * 86400n - hours * 3600n - minutes * 60n
      yield `${days ? days.toString() + 'D:' : ''}` +
        hours.toString().padStart(2, '0') +
        'H:' +
        minutes.toString().padStart(2, '0') +
        'm:' +
        seconds.toString().padStart(2, '0') +
        's'
      await new Promise((r) => setTimeout(r, 1000))
    } while (timeLeft > 1)
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
        let week = await weekStatistic(await getWeek())
        this.rewards = (BigInt(week.weeklyStatistic?.volumeVote??0) * 4n) / 100n
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
      <div class="text-right">
        <div class="font-light text-2xl text-highlight">
          ${when(
            this.pending,
            () => html`<i class="text-lg mdi mdi-loading"></i>`,
            () =>
              html`<ui-button
                  icon
                  class="ml-1 mx-auto sm"
                  @click="${this.open}"
                  ?disabled="${this.disabled}"
                  title="Claim"
                  ><i class="mdi mdi-hand-coin-outline"></i></ui-button
                >${formatUnits(this.rewards, 18)}`
          )}
        </div>
        <div class="text-green-500 mt-2">${asyncReplace(this.timeCountDown())}</div>
      </div>
      ${when(this.dialog, () => html`<claim-reward-dialog @close=${this.close}></claim-reward-dialog>`)}
    `
  }
}
