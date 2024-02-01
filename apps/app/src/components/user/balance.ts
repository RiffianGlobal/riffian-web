import { ThemeElement, classMap, customElement, html, property } from '@riffian-web/ui/shared/theme-element'
import { balanceStore, StateController } from '~/store/balance'

@customElement('account-balance')
export class AccountBalance extends ThemeElement('') {
  bindBalance: any = new StateController(this, balanceStore)

  @property({ type: String }) class = ''

  get showBalance() {
    if (!balanceStore.balance) return '-'
    return (+balanceStore.balance).toFixed(4)
  }

  render() {
    return html`<span class=${classMap(this.$c([this.class]))}>${this.showBalance}</span>`
  }
}
