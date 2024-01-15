import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from './store'
// Components
import { ThemeElement, html, customElement, state, when } from '@riffian-web/ui/shared/theme-element'
import './tasks'
import '@riffian-web/ui/dialog'

@customElement('reward-dialog')
export class RewardDialog extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() err = ''
  @state() scene = ''

  close = () => {
    this.emit('close')
  }

  chgScene = (e?: CustomEvent) => (this.scene = e?.detail ?? e ?? '')

  render() {
    return html`<ui-dialog @close=${this.close}>
      <!-- header -->
      <div slot="header" class="flex h-4">
        ${when(
          this.scene,
          () => html`
            <ui-link @click="${() => this.chgScene()}"><i class="mdi mdi-chevron-left text-xl"></i>Back</ui-link>
          `,
          () => html`<span class="inline-flex">Rewards</span>`
        )}
      </div>
      <reward-tasks .scene=${this.scene} @close=${this.close} @scene=${this.chgScene}></reward-tasks>
      <div slot="bottom"></div>
    </ui-dialog>`
  }
}
