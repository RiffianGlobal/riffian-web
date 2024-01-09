import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from './store'
// Components
import { ThemeElement, html, customElement, state } from '@riffian-web/ui/shared/theme-element'
import './tasks'
import '@riffian-web/ui/dialog'

@customElement('reward-dialog')
export class RewardDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() err = ''

  close = () => {
    this.emit('close')
  }

  render() {
    return html`<ui-dialog @close=${this.close}>
      <!-- header -->
      <p slot="header">Rewards</p>
      <reward-tasks @close=${this.close}></reward-tasks>
    </ui-dialog>`
  }
}
