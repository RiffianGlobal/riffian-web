import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from '~/store/reward'
// Components
import { ThemeElement, html, customElement, state, when } from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/button'
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
      <!-- Unboound tip -->
      ${when(
        rewardStore.socialNotClaimed,
        () =>
          html`<span @click=${this.open} class="twTip absolute top-1.5 whitespace-nowrap right-full cursor-pointer">
            <span class="border text-gray-200 bg-gray-700 rounded-md border-gray-800 p-1 px-2"
              >Bind twitter to get <span class="ui-em">${rewardStore.taskHumanized.tweet}</span></span
            ><i class="mdi mdi-arrow-right-thin"></i>
          </span>`
      )}

      <!-- Button -->
      <ui-button @click=${this.open} text sm class="outlined">
        <span class="inline-flex gap-2 items-center"
          >${coinSvg}<span class="ui-em">${rewardStore.totalHumanized ?? '-'}</span></span
        >
      </ui-button>
      <!-- Dialog -->
      ${when(this.dialog, () => html`<reward-dialog @close=${this.close}></reward-dialog>`)}
    `
  }
}
