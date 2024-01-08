import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from './store'
// Components
import { ThemeElement, html, customElement, state, when } from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/button'
import '~/components/referral/bind'
import './dialog'

// Style
import { coinSvg } from './icon'
import style from './btn.css?inline'

@customElement('reward-btn')
export class RewardBtn extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() dialog = false

  open = async () => {
    this.dialog = true
  }

  close = () => (this.dialog = false)

  connectedCallback() {
    super.connectedCallback()
    rewardStore.update()
  }

  render() {
    return html`
      <!-- Button -->
      <ui-button @click=${this.open} text sm class="outlined">
        <span class="inline-flex gap-2 items-center"
          ><span class="text-white opacity-60">Airdrop</span>${coinSvg}<span class="text-highlight"
            >${rewardStore.totalHumanized ?? '-'}</span
          ></span
        >
      </ui-button>
      <!-- Dialog -->
      ${when(this.dialog, () => html`<reward-dialog @close=${this.close}></reward-dialog> `)}
    `
  }
}
