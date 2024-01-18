import { ThemeElement, html, customElement, until, state, when } from '@riffian-web/ui/shared/theme-element'
import { StateController, rewardStore } from '~/store/reward'
import { weeklyStore } from '~/store/weekly'
// Components
import '~/components/top/list'
import '~/components/createAlbum/btn'
import '~/components/createAlbum/socialbtn'
import '~/components/latest/votes'

// Style
import style from './index.css?inline'
import { screenStore } from '@lit-web3/base/screen'

@customElement('view-home')
export class ViewHome extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  bindStore: any = new StateController(this, rewardStore)
  bindWeekly: any = new StateController(this, weeklyStore)

  get isMobi() {
    return screenStore.screen.isMobi
  }

  async connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html` <div
      class="ui-container flex flex-col lg_flex-row lg_mt-8 px-2 lg_px-8 gap-4 lg_gap-12 place-content-center"
    >
      <!-- Weekly -->
      <div class="home-board">
        <div class="home-board-header">
          <div class="home-board-lead">
            <h5>Weekly</h5>
            <div class="home-board-subtitle">
              ${when(
                weeklyStore.latest,
                () =>
                  html`${weeklyStore.latestRange}, <span class="text-green-500">${weeklyStore.latestLeft}</span> left`
              )}
            </div>
          </div>
          <div class="home-board-lead">
            ${when(
              rewardStore.inited,
              () =>
                html`<h5>
                  <span class="text-base text-gray-300">Pool: </span>
                  <span class="ui-em text-xl">${rewardStore.weeklyPool || 0}</span>
                </h5>`,
              () => html`<i class="mdi mdi-loading"></i>`
            )}
          </div>
        </div>
        <top-album weekly></top-album>
      </div>
      ${when(
        true,
        () => html`
          <!-- Top 10 -->
          <div class="home-board">
            <div class="home-board-header">
              <div class="home-board-lead">
                <div class="text-xl">Top 10</div>
              </div>
            </div>
            <top-album></top-album>
          </div>
          <!-- Votes -->
          <div class="home-board">
            <div class="home-board-header">
              <div class="text-xl">Votes</div>
            </div>
            <latest-votes></latest-votes>
          </div>
        `
      )}
    </div>`
  }
}
