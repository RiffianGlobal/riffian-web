import { ThemeElement, html, customElement, until, state, when } from '@riffian-web/ui/shared/theme-element'
import { StateController, rewardStore } from '~/components/reward/store'
// Components
import '~/components/top/list'
import '~/components/createAlbum/btn'
import '~/components/createAlbum/socialbtn'
import '~/components/latest/votes'

// Style
import style from './index.css?inline'
import { getWeek } from '~/components/rewards/action'
import { screenStore } from '@lit-web3/base/screen'

@customElement('view-home')
export class ViewHome extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() weekCD = ''
  @state() weekRange = ''
  @state() weekBegin = 0n

  get isMobi() {
    return screenStore.screen.isMobi
  }

  async connectedCallback() {
    super.connectedCallback()
    this.weekBegin = await getWeek()
    this.getWeekCD()
    this.getWeekRange()
  }

  getWeekRange = async () => {
    const weekSeconds = 7n * 24n * 60n * 60n
    let weekEnd = this.weekBegin + weekSeconds,
      dateBegin = new Date(Number(this.weekBegin * 1000n)),
      dateEnd = new Date(Number(weekEnd * 1000n))
    this.weekRange =
      dateBegin.toLocaleString('en-US', { month: 'short' }) +
      dateBegin.getDate() +
      (dateBegin.getFullYear() == dateEnd.getFullYear() ? '' : ', ' + dateBegin.getFullYear()) +
      '-' +
      (dateBegin.getMonth() == dateEnd.getMonth() ? '' : dateEnd.toLocaleString('en-us', { month: 'short' })) +
      dateEnd.getDate() +
      ' ' +
      dateEnd.getFullYear()
  }

  getWeekCD = () => {
    const weekSeconds = 7n * 24n * 60n * 60n
    let tsNow = BigInt(new Date().getTime()) / 1000n
    const timeLeft = this.weekBegin + weekSeconds - tsNow
    let days = timeLeft / 86400n,
      hours = (timeLeft - days * 86400n) / 3600n,
      minutes = (timeLeft - days * 86400n - hours * 3600n) / 60n,
      seconds = timeLeft - days * 86400n - hours * 3600n - minutes * 60n
    this.weekCD = [days * 24n + hours, minutes, seconds].map((r) => (r + '').padStart(2, '0')).join(':')
    setTimeout(this.getWeekCD, 1000)
  }

  render() {
    return html`<div
      class="ui-container flex flex-col lg_flex-row lg_mt-8 px-2 lg_px-8 gap-4 lg_gap-12 place-content-center"
    >
      <!-- Weekly -->
      <div class="home-board">
        <div class="home-board-header">
          <div class="home-board-lead">
            <h5>Weekly</h5>
            <div class="home-board-subtitle">
              ${when(
                this.weekRange,
                () => html`${this.weekRange}, <span class="text-green-500">${this.weekCD}</span> left`
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
