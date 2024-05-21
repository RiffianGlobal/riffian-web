import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore, rewardTasks } from '~/store/reward'
import { formatUnits, FixedNumber } from 'ethers'
// Components
import {
  ThemeElement,
  html,
  customElement,
  classMap,
  state,
  when,
  property
} from '@riffian-web/ui/shared/theme-element'
import '../claim'
import '@riffian-web/ui/button'
import '@riffian-web/ui/link'
import { toast } from '@riffian-web/ui/toast'

// Style
import style from './tasks.css?inline'

@customElement('reward-task')
export class RewardTask extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @property() reward?: any

  chgScene = () => {
    this.emit('scene', this.reward?.key)
  }

  render() {
    return html`<div
      class="flex w-full justify-between items-center ${classMap({ 'text-gray-600': this.reward?.closed })}"
    >
      <!-- Reward Name -->
      <span>${this.reward.title}
        <!-- Reward Action -->
        <ui-link @click=${this.chgScene} class="ml-1">
          Details>
        </ui-link>
      </span>

      <div class="flex gap-2 items-center text-right">
        <!-- Reward Amnt -->
        <span class="${classMap({ 'text-green-600': +this.reward.amnt > 0, 'font-bold': +this.reward.amnt > 0 })}"
          >${this.reward.closed || this.reward?.claimed ? '' : this.reward.amnt}</span
        >

        <div class="w-[6em] h-[2em]"></div>
      </div>
    </div>`
  }
}