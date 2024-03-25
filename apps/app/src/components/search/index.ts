import {
  ThemeElement,
  customElement,
  html,
  state,
  ref,
  createRef,
  keyed,
  classMap
} from '@riffian-web/ui/shared/theme-element'
import { goto } from '@lit-web3/router'
import emitter from '@lit-web3/base/emitter'
import { chartsStore, StateController } from '~/store/charts'
// Components
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/menu/drop'
import '~/components/top/subject-brief'
import './list'

import style from './index.css?inline'

@customElement('object-search')
export class ObjectSearch extends ThemeElement(style) {
  input$: any = createRef()
  bindCharts: any = new StateController(this, chartsStore)

  @state() menu = false
  @state() pending = false
  @state() keyword = ''
  @state() subjects = []
  @state() focused = false

  get len() {
    return this.subjects.length
  }
  get empty() {
    return !this.pending && !this.len
  }

  show = () => {
    this.menu = !!this.keyword
  }
  close = () => {
    this.menu = false
    this.input$.value?.clear()
    this.subjects = []
  }
  onInput = async (e: CustomEvent) => {
    this.keyword = e.detail
    this.show()
  }
  goSearch = () => {
    goto(`/search/${this.keyword}`)
  }

  onFocus() {
    this.focused = true
  }
  onBlur() {
    this.focused = false
  }

  connectedCallback() {
    super.connectedCallback()
    emitter.on('router-change', this.close)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('router-change', this.close)
  }

  render() {
    return html`
      <!-- Menu -->
      <ui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => {}}
        @close=${() => this.close()}
        btnSm
        text
        ignoreToggle
        dropClass="!w-full !left-0 !right-0 !top-full !bottom-auto !min-h-12"
        class="w-full"
      >
        <!-- Keyword -->
        <div slot="toggle" class="w-full">
          <ui-input-text
            @input=${this.onInput}
            @submit=${this.goSearch}
            @focus="${this.onFocus}"
            @blur="${this.onBlur}"
            .value=${this.keyword}
            ${ref(this.input$)}
            placeholder="Search"
            dense
            sm
            filled
            class="w-full block"
          >
            <span class="transition-all ${classMap(this.$c([this.focused ? '' : 'opacity-50']))}" slot="right"
              ><ui-button @click=${this.goSearch} icon class="-mr-1"
                ><i class="mdi mdi-magnify text-white"></i></ui-button
            ></span>
          </ui-input-text>
        </div>
        <!-- Result -->
        ${keyed(this.keyword, html`<object-search-list lite sm .keyword=${this.keyword}></object-search-list>`)}
      </ui-drop>
    `
  }
}
