import { TailwindElement, html, customElement, until } from '@riffian-web/ui/src/shared/TailwindElement'
import '~/components/top/list'
import '~/components/createAlbum/btn'
import '~/components/createAlbum/socialbtn'
import '~/components/rewards/claim'

// Style
import style from './index.css?inline'
import { getWeek } from '~/components/rewards/action'

@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  connectedCallback() {
    super.connectedCallback()
  }

  async weekRange() {
    return getWeek().then((weekBegin) => {
      const weekSeconds = 7n * 24n * 60n * 60n
      let weekEnd = weekBegin + weekSeconds,
        dateBegin = new Date(Number(weekBegin * 1000n)),
        dateEnd = new Date(Number(weekEnd * 1000n))
      console.log(weekBegin, dateBegin)
      return (
        dateBegin.toLocaleString('en-US', { month: 'short' }) +
        (dateBegin.getFullYear() == dateEnd.getFullYear() ? '' : dateEnd.getFullYear()) +
        dateBegin.getDate() +
        '-' +
        (dateBegin.getMonth() == dateEnd.getMonth() ? '' : dateEnd.toLocaleString('en-us', { month: 'short' })) +
        dateEnd.getDate() +
        ' ' +
        (dateBegin.getFullYear() == dateEnd.getFullYear() ? dateBegin.getFullYear() : dateEnd.getFullYear())
      )
    })
  }

  render() {
    return html`<div class="ui-container">
      <div class="flex flex-row-reverse">
        <create-album-btn></create-album-btn>
        <bind-social-btn></bind-social-btn>
      </div>
      <div class="relative flex justify-between items-center">
        <div>
          <p class="font-bold text-2xl text-highlight">Weekly</p>
          <span>${until(this.weekRange())}</span>
        </div>
        <div><claim-rewards></claim-rewards></div>
      </div>
      <div class="ui-container">
        <top-album></top-album>
      </div>
    </div>`
  }
}
