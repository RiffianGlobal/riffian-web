import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { weeklyReward } from './action'
import { formatUnits } from 'ethers'
// Components
import '@riffian-web/ui/src/button'
import './dialog'

@customElement('claim-rewards')
export class ClaimRewards extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)

  @state() rewards = 0
  @state() pending = true
  @state() dialog = false

  get disabled() {
    return !bridgeStore.bridge.account
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.weeklyRewards()
  }

  async weeklyRewards() {
    try {
      this.pending = true
      let result = await weeklyReward()
      console.log(result)
      this.rewards = result
    } catch (err: any) {
      let msg = err.message || err.code
    } finally {
      this.pending = false
    }
  }

  open = () => (this.dialog = true)
  close = () => (this.dialog = false)

  render() {
    return html`
      ${when(this.pending, () => html`<i class="text-lg mdi mdi-loading"></i>`)}
      ${when(
        !this.pending,
        () =>
          html`<span class="text-lg font-bold">
            <span class="text-sm">REWARD POOL</span>
            <span class="italic text-2xl"> ${formatUnits(this.rewards, 18)} </span>
            <span class="text-sm text-gray-400">FTM</span>
            <ui-button icon class="ml-1 mx-auto sm" @click="${this.open}" ?disabled="${this.disabled}" title="Claim"
              ><i class="mdi mdi-swap-horizontal"></i
            ></ui-button>
            ${when(this.dialog, () => html`<claim-reward-dialog @close=${this.close}></claim-reward-dialog>`)}
          </span> `
      )}
    `
  }
}
