import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore, rewardTasks } from './store'
import { formatUnits, FixedNumber } from 'ethers'
// Components
import { ThemeElement, html, customElement, repeat, state, when } from '@riffian-web/ui/shared/theme-element'
import './claim'
import '~/components/rewards/dialog'

// Style
import style from './task.css?inline'

@customElement('reward-tasks')
export class RewardTasks extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() err = ''

  close = () => {
    this.emit('close')
  }

  // TODO: merge to rewardStore
  get voteReward() {
    if (!rewardStore.inited) return
    const total = rewardStore.weeklies.reduce((cur, next) => cur + (next?.reward ?? 0n), 0n)
    return {
      ...rewardTasks[0],
      amnt: (+formatUnits(total)).toFixed(4)
    }
  }

  render() {
    return html`<div class="h-64">
      <p class="ui-em mb-6 text-xl text-center">${rewardStore.totalHumanized}</p>
      <ul class="ui-list dense bordered">
        ${when(
          this.voteReward,
          () =>
            html`<li>
              <reward-claim
                @error=${(e: CustomEvent) => (this.err = e.detail)}
                @click=${() => (this.err = '')}
                @close=${this.close}
                .reward=${this.voteReward}
              ></reward-claim>
            </li>`
        )}
        ${repeat(
          rewardStore.rewardsHumanized,
          (reward) => html`
            <li>
              <reward-claim
                @error=${(e: CustomEvent) => (this.err = e.detail)}
                @click=${() => (this.err = '')}
                @close=${this.close}
                .reward=${reward}
              ></reward-claim>
            </li>
          `
        )}
      </ul>
      <p class="text-center text-orange-600">${this.err}</p>
    </div>`
  }
}
