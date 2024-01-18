import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore, rewardTasks } from '~/store/reward'
import { formatUnits, FixedNumber } from 'ethers'
// Components
import {
  ThemeElement,
  html,
  customElement,
  repeat,
  state,
  when,
  choose,
  property
} from '@riffian-web/ui/shared/theme-element'
import '../claim'
import '~/components/rewards/dialog'
import '@riffian-web/ui/link'
import { toast } from '@riffian-web/ui/toast'
import './task'
import './task-weeklyvotes'
import './task-social'

// Style
import style from './tasks.css?inline'

export type SceneOption = '' | 'votes' | 'social'

@customElement('reward-tasks')
export class RewardTasks extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @property() scene: SceneOption = ''

  @state() err = ''

  close = () => {
    this.emit('close')
  }

  showErr = (e: CustomEvent) => {
    toast.add({ summary: 'Claim failed', detail: e.detail })
  }

  // TODO: merge to rewardStore
  get voteReward() {
    if (!rewardStore.inited) return
    return {
      ...rewardTasks[0],
      amnt: (+formatUnits(rewardStore.votesTotal)).toFixed(4)
    }
  }

  chgScene = (e?: CustomEvent) => this.emit('scene', e?.detail ?? e ?? '')
  back = () => this.emit('back')

  render() {
    return html`<div class="h-80 -mt-2 overflow-y-auto canScroll">
      ${choose(this.scene, [
        [
          '', // Tasks
          () =>
            html`<p class="ui-em mb-6 text-xl text-center">${rewardStore.totalHumanized}</p>
              <ul class="ui-list dense bordered">
                ${when(
                  this.voteReward,
                  () => html`<reward-task @scene=${this.chgScene} .reward=${this.voteReward}></reward-task>`
                )}
                ${repeat(
                  rewardStore.rewardsHumanized,
                  (reward) => html`
                    <li>
                      <reward-claim
                        @scene=${this.chgScene}
                        @error=${this.showErr}
                        @click=${() => (this.err = '')}
                        @close=${this.close}
                        .reward=${reward}
                      ></reward-claim>
                    </li>
                  `
                )}
              </ul>`
        ],
        [
          'votes', // Weekly votes
          () => html`<task-weeklyvotes @back=${this.back}></task-weeklyvotes>`
        ],
        [
          'social', // Bind social
          () => html`<task-social @back=${this.back}></task-social>`
        ]
      ])}
    </div> `
  }
}
