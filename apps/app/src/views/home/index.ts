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
        dateBegin.getDate() +
        (dateBegin.getFullYear() == dateEnd.getFullYear() ? '' : ', ' + dateEnd.getFullYear()) +
        '-' +
        (dateBegin.getMonth() == dateEnd.getMonth() ? '' : dateEnd.toLocaleString('en-us', { month: 'short' })) +
        dateEnd.getDate() +
        ', ' +
        dateEnd.getFullYear()
      )
    })
  }

  render() {
    return html`<div class="ui-container">
      <div class="ui-container relative flex justify-between items-center">
        <div>
          <div class="font-bold text-2xl text-highlight">Weekly</div>
          <div class="font-light mt-2">${until(this.weekRange())}</div>
        </div>
        <div class="flex flex-row-reverse">
          <claim-rewards></claim-rewards>
          <bind-social-btn></bind-social-btn>
          <create-album-btn icon></create-album-btn>
        </div>
      </div>
      <div class="ui-container mt-3">
        <top-album></top-album>
      </div>
    </div>`
  }
}
