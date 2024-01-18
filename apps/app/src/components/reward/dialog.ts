import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from '~/store/reward'
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
  back = () => (this.scene = '')

  render() {
    return html`<ui-dialog @close=${this.close} wrapperClass="!max-w-[30rem]" part="dialog-container">
      <!-- header -->
      <div slot="header" class="flex h-4">
        ${when(
          this.scene,
          () => html`
            <ui-link @click="${this.back}"><i class="mdi mdi-chevron-left text-xl"></i>All rewards</ui-link>
          `,
          () => html`<span class="inline-flex">Rewards</span>`
        )}
      </div>
      <reward-tasks .scene=${this.scene} @close=${this.close} @scene=${this.chgScene} @back=${this.back}></reward-tasks>
      <div slot="bottom"></div>
    </ui-dialog>`
  }
}
