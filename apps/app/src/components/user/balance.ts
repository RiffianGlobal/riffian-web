import {
  ThemeElement,
  classMap,
  customElement,
  html,
  property,
  state,
  when
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController, getNativeBalance } from '@riffian-web/ethers/src/useBridge'
import { formatUnits } from 'ethers'

@customElement('account-balance')
export class AccountBalance extends ThemeElement('') {
  @property({ type: String }) class = ''
  bindBridge: any = new StateController(this, bridgeStore)
  @state() balance = ''

  get account() {
    return bridgeStore.bridge.account
  }
  get showBalance() {
    return this.balance === '' ? this.balance : (+this.balance).toFixed(4)
  }

  getBalance = async () => {
    if (!this.account) return
    this.balance = await getNativeBalance(this.account)
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.getBalance()
  }
  render() {
    return html`${when(
      this.account,
      () => html` <span class=${classMap(this.$c([this.class]))}>${this.showBalance}</span> `
    )} `
  }
}