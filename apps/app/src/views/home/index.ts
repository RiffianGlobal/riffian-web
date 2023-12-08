import { TailwindElement, html, customElement, until, classMap, when } from '@riffian-web/ui/src/shared/TailwindElement'
import '~/components/top/list'
import '~/components/createAlbum/btn'
import '~/components/createAlbum/socialbtn'
import '~/components/rewards/claim'

// Style
import style from './index.css?inline'
import { getWeek } from '~/components/rewards/action'
import { StateController, screenStore } from '@riffian-web/core/src/screen'

@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  bindScreen: any = new StateController(this, screenStore)

  get isSmall() {
    return screenStore.screen.lg
  }

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
    return html`<div class="flex px-8 space-x-8 place-content-center">
      <div class="flex-initial w-[32rem]">
        <div class="flex justify-between h-20">
          <div>
            <div class="font-bold text-2xl text-highlight">Weekly</div>
            <div class="font-light mt-2">${until(this.weekRange())}</div>
          </div>
          <div class="flex flex-row-reverse">
            <claim-rewards></claim-rewards>
            <bind-social-btn></bind-social-btn>
          </div>
        </div>
        <div class="mt-3">
          <top-album></top-album>
        </div>
      </div>
      ${when(
        !this.isSmall,
        () =>
          html` <div class="flex-none w-[32rem]">
            <div class="h-20 pt-1">
              <div class="font-bold text-xl">All</div>
            </div>
            <div class="mt-3">
              <top-album></top-album>
            </div>
          </div>`
      )}
    </div>`
  }
}
