import { ThemeElement, customElement, html, property, classMap } from '@riffian-web/ui/shared/theme-element'

@customElement('chg-stat')
export class ChgStat extends ThemeElement('') {
  @property({ type: Object }) chg?: any

  render() {
    if (this.chg.val == 0) return this.chg.per
    return html`<span
      class="${classMap({ 'text-green-500': this.chg.stat == 'up', 'text-red-500': this.chg.stat == 'down' })}"
      >${this.chg.per}</span
    >`
  }
}
