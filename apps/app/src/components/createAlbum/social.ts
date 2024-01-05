import { TailwindElement, customElement, html, repeat, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { bindSocial, getSocials } from './action'
// Components
import '@riffian-web/ui/src/button'
import '@riffian-web/ui/src/input/text'
import '@riffian-web/ui/src/tx-state'

type formKeys = 'platform' | 'id' | 'url'

const defFrom = () => ({ platform: '', id: '', url: '' })
const defErr = () => ({ album: '', symbol: '', tx: '', load: '' })

enum SOCIAL_TYPE {
  'TWI' = 'twitter'
}
@customElement('create-social-dialog')
export class CreateSocailDialog extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() url = ''
  @state() platform = SOCIAL_TYPE.TWI
  @state() id = ''
  @state() form = defFrom()
  @state() err = defErr()
  @state() pending = false
  @state() success = false
  @state() tx: any = null
  @state() socials: any
  @state() ts = 0

  connectedCallback() {
    super.connectedCallback()
    this.getSocialUrl()
  }

  async getSocialUrl() {
    try {
      this.socials = await getSocials(bridgeStore.bridge.account as string)
    } catch (err: any) {
      const msg = err.message || err.code
      this.updateErr({ load: msg })
    } finally {
      this.ts++
    }
  }

  get socialEmpty() {
    return this.ts && !this.socials.length
  }
  get invalid() {
    return !this.form.url //|| !this.form.platform || !this.form.id
  }
  get txPending() {
    return this.tx && !this.tx.ignored
  }

  updateForm = (form = {}) => (this.form = Object.assign({}, this.form, form))
  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))

  async onInput(e: CustomEvent, key: formKeys) {
    this.updateForm({ [key]: e.detail })
    this.updateErr({ [key]: '', tx: '' })
    if (this.form[key].length < 4) {
      this.updateErr({ [key]: 'Invalid input' })
    }
  }

  resetState = () => {
    this.form = defFrom()
    this.err = defErr()
    this.pending = false
    this.success = false
  }
  close = async () => {
    this.tx = null
    this.resetState()
    this.emit('close')
  }

  async create() {
    this.pending = true
    try {
      this.tx = await bindSocial(SOCIAL_TYPE.TWI, '', this.form.url)
      this.success = await this.tx.wait()
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) {
        this.updateErr({ tx: msg })
        return this.close()
      }
    } finally {
      this.pending = false
    }
  }

  render() {
    return html`<ui-dialog @close=${this.close}>
      <p slot="header" class="w-full mr-2 text-base">Bind Social Account</p>
      <!-- Current social accounts -->
      ${when(
        !this.socialEmpty,
        () =>
          html`<div class="pb-8 border-b" style="border-color: rgba(255, 255, 255, .12)">
            <div class="mb-4">Current:</div>
            <ul class="px-4 py-6 divide-y divide-solid divide-slate-50 rounded-md" style="background: #181832">
              ${repeat(
                this.socials,
                (item: any) =>
                  html`<li class="text-base "><span class="opacity-60 mr-2">${item[0]}:</span>${item[2]}</li> `
              )}
            </ul>
          </div>`
      )}
      <!-- Edit one social account -->
      <div class="flex flex-col w-full gap-4 m-4 mx-auto mt-6">
        <!-- Tx pending -->
        ${when(
          this.txPending,
          () =>
            html`<tx-state .tx=${this.tx} .opts=${{ state: { success: 'Success. Socail binding success.' } }}
              ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
            >`
        )}
        <!-- Form -->
        ${when(
          !this.txPending,
          () => html`
            <ui-link
              class="text-sm"
              href="https://twitter.com/intent/tweet?text=My%20account%20on%20riffian%20is%20${bridgeStore.bridge
                .account}"
              >Click here to post a tweet with your account address and copy your tweet url bellow.</ui-link
            >
            <ui-input-text
              value=${this.form.url}
              @input=${(e: CustomEvent) => this.onInput(e, 'url')}
              placeholder=${'Your ' + this.platform + ' account URI'}
              required
            >
              <span slot="label">URI</span>
            </ui-input-text>
            <ui-button
              class="mx-auto"
              @click=${this.create}
              ?disabled="${this.invalid || this.pending}"
              ?pending=${this.pending}
              >Confirm<i class="mdi ${this.pending ? 'mdi-loading' : ''}"></i
            ></ui-button>
          `
        )}
      </div>
      <div slot="bottom"></div>
    </ui-dialog>`
  }
}
