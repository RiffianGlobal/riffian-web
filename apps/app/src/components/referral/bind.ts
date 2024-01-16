import { StateController, referralStore, setReferral } from './store'
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

// Style
import style from './bind.css?inline'

@customElement('referral-bind')
export class referralBind extends ThemeElement(style) {
  bindReferral: any = new StateController(this, referralStore)

  @property() address = ''

  @state() err = 'fff'

  get addr() {
    return referralStore.address || this.address
  }

  bind = async () => {
    if (referralStore.address) return
    referralStore.pending = true
    try {
      referralStore.tx = await setReferral(this.address)
      await referralStore.tx.wait()
      await referralStore.check()
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) return
      this.err = msg
    } finally {
      referralStore.pending = false
    }
  }

  connectedCallback() {
    super.connectedCallback()
    referralStore.check()
  }

  render() {
    return html`<div class="flex flex-col gap-8 mt-20">
      <div class="flex gap-3 items-center">
        <b>Referral:</b>
        <ui-input-text
          .value=${this.addr}
          readonly
          ?disabled=${referralStore.bound}
          class="w-[25em]"
          sm
        ></ui-input-text>
        <i
          class="mdi ${classMap(
            this.$c([
              referralStore.pending ? 'mdi-loading' : 'mdi-check-circle-outline invisible',
              referralStore.bound ? 'mdi-check-circle-outline text-green-600 !visible' : ''
            ])
          )}"
        ></i>
      </div>
      <!-- Button -->
      <div class="flex gap-4 items-center justify-center">
        ${when(
          !referralStore.pending && !referralStore.bound,
          () => html`<ui-button @click=${this.bind} .pending=${referralStore.pending}>Bind</ui-button>`
        )}
        <!-- TxState -->
        <div>
          ${when(
            referralStore.txPending,
            () => html`<tx-state .tx=${referralStore.tx} .opts=${{ state: { success: 'Success.' } }}></tx-state>`
          )}
        </div>
      </div>
    </div>`
  }
}
