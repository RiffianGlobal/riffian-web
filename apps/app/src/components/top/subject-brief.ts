import { ThemeElement, classMap, customElement, html, property, when } from '@riffian-web/ui/shared/theme-element'
import { go2Subject } from './actions'
import { screenStore, StateController } from '@lit-web3/base/screen'
// Components
import '@riffian-web/ui/img/loader'
import '~/components/chg-stat'

import style from './list.css?inline'

@customElement('subject-brief')
export class SubjectBrief extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)

  @property() subject: any
  @property({ type: Boolean }) sm = false
  @property({ type: Boolean }) rank = false
  @property({ type: Boolean }) lite = false

  get isMobi() {
    return screenStore.isMobi
  }
  get dense() {
    return this.lite || this.isMobi
  }

  render() {
    return html`<div
      class="subject-brief ${classMap(this.$c([this.sm ? 'sm' : '', { dense: this.dense }]))}"
      @click=${(e: Event) => go2Subject(e, this.subject)}
    >
      <slot name="left"></slot>
      <div class="subject-intro">
        <!-- Cover -->
        <div class="subject-cover">
          <img-loader src=${this.subject.cooked.src} class="rounded-lg"></img-loader>
          ${when(this.subject.cooked.src, () => html`<i class="subject-play mdi mdi-play-circle"></i>`)}
        </div>
        <!-- Content -->
        <div class="subject-intro-cnt">
          <p class="subject-name">${this.subject.name}</p>
          <p class="subject-minor">
            ${when(
              this.dense,
              () => html`<span class="mr-1 text-xs opacity-80">Price:</span>${this.subject.cooked.price}`,
              () => html`<ui-address .address=${this.subject.cooked.address} short doid></ui-address>`
            )}
          </p>
        </div>
      </div>
      <!-- Metadata -->
      ${when(
        this.dense,
        () =>
          html`<div class="subject-intro-cnt num">
            <span class="subject-line1">${this.subject.cooked.total}</span>
            <span class="text-xs"><chg-stat .chg=${this.subject.cooked.chg}></chg-stat></span>
          </div>`,
        () =>
          html`<p class="num date">${this.subject.cooked.date}</p>
            <p class="num">${this.subject.cooked.price}</p>
            <p class="num">${this.subject.cooked.total}</p>
            <p class="num per"><chg-stat .chg=${this.subject.cooked.chg}></chg-stat></p>`
      )}
    </div>`
  }
}
