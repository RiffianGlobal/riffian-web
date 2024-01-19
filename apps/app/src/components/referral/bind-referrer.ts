import { StateController, referralStore } from './store'
import { getAccount } from '@riffian-web/ethers/src/useBridge'
import emitter from '@lit-web3/base/emitter'
// Components
import {
  ThemeElement,
  html,
  customElement,
  property,
  state,
  when,
  classMap
} from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/button'
import '@riffian-web/ui/tx-state'
import { toast } from '@riffian-web/ui/toast'

// Style
import style from './bind.css?inline'

@customElement('bind-referrer')
export class BindReferrer extends ThemeElement(style) {
  bindReferral: any = new StateController(this, referralStore)

  @property() address = ''
  @state() pending = false

  get addr() {
    return referralStore.address || this.address
  }

  bind = async () => {
    if (!(await getAccount())) return emitter.emit('connect-wallet')
    this.pending = true
    if (referralStore.address) return
    try {
      await referralStore.set(this.address)
    } catch (err: any) {
      if (err.code !== 4001) {
        toast.add({ summary: 'Set Failed', detail: err.message })
      }
    } finally {
      this.pending = false
    }
  }

  connectedCallback() {
    super.connectedCallback()
    referralStore.get()
  }

  render() {
    return html`<div class="flex flex-col gap-8 w-full">
      <!-- Button -->
      <div class="mt-8">
        ${when(
          !referralStore.bound,
          () => html`<ui-button @click=${() => this.bind()} .pending=${this.pending}>Accept</ui-button>`
        )}
      </div>
      <!-- Pending -->
      <div class="">
        <i
          class="mdi ${classMap(
            this.$c([
              this.pending ? 'mdi-loading' : 'mdi-check-circle-outline invisible',
              referralStore.bound ? 'mdi-check-circle-outline text-green-600 !visible' : ''
            ])
          )}"
        ></i>
      </div>
    </div>`
  }
}
