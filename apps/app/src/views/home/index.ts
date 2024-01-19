import { ThemeElement, html, customElement, until, state, when } from '@riffian-web/ui/shared/theme-element'
import { StateController, rewardStore } from '~/store/reward'
import { screenStore } from '@lit-web3/base/screen'
import { weeklyStore } from '~/store/weekly'
// Components
import '~/components/top/weekly'
import '~/components/top/list'
import '~/components/createAlbum/btn'
import '~/components/createAlbum/socialbtn'
import '~/components/latest/votes'
import '@riffian-web/ui/link'

// Style
import style from './index.css?inline'

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
    return html` <div class="ui-pageview ui-container flex-col lg_flex-row place-content-center">
      <!-- Weekly -->
      <div class="ui-board">
        <div class="ui-board-header">
          <div class="ui-board-lead">
            <h5>Weekly</h5>
            <div class="ui-board-subtitle">
              ${when(
                weeklyStore.latest,
                () =>
                  html`${weeklyStore.latestRange}, <span class="text-green-500">${weeklyStore.latestLeft}</span> left`
              )}
            </div>
          </div>
          <div class="ui-board-lead">
            ${when(
              rewardStore.inited,
              () =>
                html`<h5>
                  <span class="text-base text-gray-300">Pool: </span>
                  <span class="ui-em text-xl">${rewardStore.weeklyPoolHumanized || '-'}</span>
                </h5>`,
              () => html`<i class="mdi mdi-loading"></i>`
            )}
          </div>
        </div>
        <weekly-top></weekly-top>
      </div>
      ${when(
        true,
        () => html`
          <!-- Top 10 -->
          <div class="ui-board">
            <div class="ui-board-header">
              <div class="ui-board-lead">
                <div class="text-xl">
                  Top 10
                  <ui-link text class="ml-1 text-xs text-blue-300" href=${'/top'}>View all</ui-link>
                </div>
              </div>
            </div>
            <top-album></top-album>
          </div>
          <!-- Votes -->
          <div class="ui-board">
            <div class="ui-board-header">
              <div class="text-xl">Votes</div>
            </div>
            <latest-votes></latest-votes>
          </div>
        `
      )}
    </div>`
  }
}
