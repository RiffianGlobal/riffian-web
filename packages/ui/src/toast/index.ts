import { ThemeElement, when, customElement, html, classMap } from '../shared/theme-element'
import { State, StateController, property } from '@lit-web3/base/state'
import { animate } from '@lit-labs/motion'
// Components
import '../button'
// Style
import style from './toast.css?inline'

class ToastStore extends State {
  @property({ value: false }) model!: boolean
  @property({ value: null }) msg!: ToastMsg | null
  @property({ value: null }) timer!: any

  close = () => {
    this.model = false
    this.msg = null
    clearTimeout(this.timer)
    this.timer = null
  }
  show = (msg?: ToastMsg) => {
    this.close()
    if (msg) this.msg = msg
    this.model = true
    setTimeout(this.close, this.msg?.life ?? 5000)
  }
}
export const toastStore = new ToastStore()

@customElement('ui-toast')
export class UIToast extends ThemeElement(style) {
  bindToast: any = new StateController(this, toastStore)

  render() {
    if (!toastStore.model) return ''
    return html`<div
      class="relative !origin-center inline-flex overflow-hidden py-3 pl-4 pr-8  m-auto rounded border border-gray-500 bg-gray-700 min-h-12 w-full lg_w-96 text-left box-border ${classMap(
        this.$c([toastStore.model ? 'opacity-100 visible' : 'opacity-0 invisible'])
      )}"
      ${animate({
        guard: () => toastStore.model,
        properties: ['opacity', 'visibility'],
        keyframeOptions: { duration: 300 }
      })}
    >
      <!-- Icon -->
      <!-- <i class="absolute left-2 top-2 mdi mdi-information-outline"></i> -->
      <div>
        <!-- Summary -->
        ${when(
          toastStore.msg?.summary,
          () => html`<p class="text-base mr-8 break-normal break-all">${toastStore.msg?.summary}</p>`
        )}
        <!-- Detail -->
        ${when(
          toastStore.msg?.detail,
          () => html`<div class="mt-2 break-normal break-all">${toastStore.msg?.detail}</div>`
        )}
        <!-- Close -->
        <ui-button @click=${toastStore.close} icon class="absolute right-1 top-1"
          ><i class="mdi mdi-close text-white"></i
        ></ui-button>
      </div>
    </div>`
  }
}

export type ToastMsg = {
  severity?: string
  summary?: string
  detail?: string
  life?: number
}

export const toast = {
  add: ({ severity = 'info', summary = '', detail = '', life = 5000 } = <ToastMsg>{}) => {
    toastStore.show({ severity, summary, detail, life })
  }
}
