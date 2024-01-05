import { ThemeElement, html, customElement, until, classMap, when } from '@riffian-web/ui/shared/theme-element'
import '~/components/top/list'
import '~/components/createAlbum/btn'
import '~/components/createAlbum/socialbtn'
import '~/components/rewards/claim'
import '~/components/latest/votes'

// Style
import style from './index.css?inline'
import { getWeek } from '~/components/rewards/action'
import { StateController, screenStore } from '@lit-web3/base/screen'

@customElement('view-home')
export class ViewHome extends ThemeElement(style) {
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
        (dateBegin.getFullYear() == dateEnd.getFullYear() ? '' : ', ' + dateBegin.getFullYear()) +
        ' - ' +
        (dateBegin.getMonth() == dateEnd.getMonth() ? '' : dateEnd.toLocaleString('en-us', { month: 'short' })) +
        dateEnd.getDate() +
        ', ' +
        dateEnd.getFullYear()
      )
    })
  }

  render() {
    return html`<div class="flex flex-col lg_flex-row px-8 lg_space-x-12 place-content-center">
      <div class="lg_flex-initial w-full lg_w-[30rem]">
        <div class="flex justify-between h-20 lg_mt-8">
          <div>
            <div class="text-2xl">Weekly</div>
            <div class="text-neutral-400 mt-2">${until(this.weekRange())}</div>
          </div>
          <div class="flex flex-row-reverse">
            <claim-rewards></claim-rewards>
            <bind-social-btn></bind-social-btn>
          </div>
        </div>
        <div class="mt-3">
          <top-album weekly></top-album>
        </div>
      </div>
      ${when(
        !this.isSmall,
        () => html`
          <div class="flex-initial w-full lg_w-[30rem]">
            <div class="h-20 pt-1 lg_mt-8">
              <div class="text-xl">All</div>
            </div>
            <div class="mt-3">
              <top-album></top-album>
            </div>
          </div>
          <div class="flex-initial w-full lg_w-32 ">
            <div class="h-20 pt-1 lg_mt-8">
              <div class="text-xl">Votes</div>
            </div>
            <latest-votes></latest-votes>
          </div>
        `
      )}
    </div>`
  }
}
