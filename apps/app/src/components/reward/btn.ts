import emitter from '@lit-web3/base/emitter'
import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from '~/store/reward'
import { screenStore } from '@lit-web3/base/screen'
import { storage, property } from '@lit-web3/base/state'
// Components
import { ThemeElement, html, customElement, state, when, classMap } from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/button'
import './dialog'

// Style
import { coinSvg } from './icon2'
import style from './btn.css?inline'

const tipKey = 'tip.x'

@customElement('reward-btn')
export class RewardBtn extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)
  bindScreen: any = new StateController(this, screenStore)

  @state() dialog = false
  @state() twitterTipReaded = localStorage.getItem(tipKey)

  open = () => {
    this.dialog = true
  }
  openByTip = () => {
    this.open()
    if (!this.twitterTipReaded) {
      localStorage.setItem(tipKey, (this.twitterTipReaded = '1'))
    }
  }

  get tipReaded() {
    if (screenStore.isMobi) return this.twitterTipReaded
    return false
  }

  close = () => (this.dialog = false)

  connectedCallback() {
    super.connectedCallback()
    emitter.on('reward-show', this.open)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('reward-show', this.open)
  }

  render() {
    return html`
      <!-- Unboound tip -->
      ${when(
        !this.tipReaded && rewardStore.socialNotClaimed,
        () =>
          html`<span
            @click=${this.openByTip}
            class="twTip ${classMap({
              mobi: screenStore.isMobi
            })}"
          >
            <span class="twTip-cnt">Bind twitter to get <b class="ui-em">${rewardStore.taskHumanized.tweet}</b></span>
            <i
              class="mdi absolute ${classMap(
                this.$c([
                  screenStore.isMobi ? 'mdi-arrow-down-thin top-[90%]' : 'mdi-arrow-up-thin left-[50%] bottom-[110%]'
                ])
              )}"
            ></i>
          </span>`
      )}

      <!-- Button -->
      <slot @click=${this.open}
        ><ui-button @click=${this.open} text sm class="outlined">
          <span class="inline-flex gap-2 items-center"
            >${coinSvg}<span class="ui-em">${rewardStore.totalHumanized ?? '-'}</span></span
          >
        </ui-button></slot
      >

      <!-- Dialog -->
      ${when(this.dialog, () => html`<reward-dialog @close=${this.close}></reward-dialog>`)}
    `
  }
}
