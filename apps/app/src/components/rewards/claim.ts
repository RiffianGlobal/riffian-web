import { TailwindElement, customElement, html, property, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { weeklyReward } from './action'
import { formatUnits } from 'ethers'
// Components
import '@riffian-web/ui/src/button'

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
      let result = await weeklyReward(bridgeStore.bridge.account)
      // this.pending = false
      console.log('get rewards:' + result)
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
          html`<span class="text-lg font-bold">${formatUnits(Number(this.rewards), 18)} </span>FTM
            <ui-button icon class="ml-1 mx-auto sm" @click="${this.open}" ?disabled="${this.disabled}" title="Claim"
              ><i class="mdi mdi-swap-horizontal"></i
            ></ui-button>`
      )}
    `
  }
}
