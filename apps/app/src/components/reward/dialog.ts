import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from './store'
import { emitter } from '@lit-web3/base'
// Components
import { ThemeElement, html, customElement, when, classMap, repeat, state } from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/input/text'
import './claim'
import '@riffian-web/ui/dialog'
import '~/components/referral/bind'

// Style
import style from './btn.css?inline'

@customElement('reward-dialog')
export class RewardDialog extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() err = ''

  close = () => {
    this.emit('close')
  }
  bindSocial = () => {
    emitter.emit('ui-bindsocial')
    setTimeout(this.close, 300)
  }

  render() {
    return html`<ui-dialog @close=${this.close}>
      <!-- header -->
      <p slot="header">Rewards</p>
      <div class="h-48">
        <ul class="ui-list">
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
      </div>
    </ui-dialog>`
  }
}
