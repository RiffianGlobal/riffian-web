import { ThemeElement, customElement, html, property, repeat, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { albumList, weekList } from './action'
import { goto } from '@lit-web3/router'
import { isImage } from '@lit-web3/base/MIMETypes'
// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
// import '~/components/symbol'
import emitter from '@lit-web3/base/emitter'

import style from './list.css?inline'
import { getWeek } from '../rewards/action'
import { formatUnits } from 'ethers'
@customElement('top-album')
export class TopAlbum extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) weekly = false
  @state() subjectList: any
  @state() showAlbumVote = false
  @state() albumToVote = { id: '', supply: 0, url: '', name: '', creator: { address: '' }, uri: '', image: '' }
  @state() pending = false
  @state() prompt = false
  @state() promptMessage: string = ''

  get disabled() {
    return !bridgeStore.bridge.account
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.fetch()
    emitter.on('toplist-fetch', this.fetch)
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  fetch = async () => {
    this.pending = true
    try {
      let result = this.weekly ? await weekList(10, await getWeek()) : await albumList(10)
      this.subjectList = this.weekly ? result.subjectWeeklyVotes : result.subjects
    } catch (e: any) {
      console.error(e)
      this.promptMessage = e
      this.prompt = true
      return
    }
    this.pending = false

    let urls = [
      'https://cdn.shopify.com/app-store/listing_images/a82167e02b45cadf681efc6c17c35f3a/icon/CMmMjb30lu8CEAE=.jpg'
    ]
    for (var i = 0; i < this.subjectList.length; i++) {
      if (this.weekly) {
        let weekResult = this.subjectList[i]
        this.subjectList[i] = weekResult.subject
        this.subjectList[i].volumeTotal = weekResult.volumeTotal
      }
      if (
        !this.subjectList[i].image ||
        (!isImage(this.subjectList[i].image) && !this.subjectList[i].image.startsWith('http'))
      ) {
        this.subjectList[i].image = urls[0]
      }
    }
  }

  close = () => {
    this.showAlbumVote = false
    this.fetch()
  }

  static dayChange(item: any) {
    if (item.voteLogs.length == 0) {
      return 'New'
    } else {
      let before = item.voteLogs[0].supply,
        end = item.supply,
        diff = Math.abs(before - end),
        change = ((diff * 100.0) / before).toFixed(1)
      if (before > end) return html`<p class="text-red-500 ">-${change}%</p>`
      else return html`<p class="text-green-500 ">+${change}%</p>`
    }
  }

  go2 = (item: any) => {
    if (this.disabled) {
      emitter.emit('connect-wallet')
    } else {
      this.albumToVote = item
      // this.showAlbumVote = true
      goto(`/track/${item.id}`)
    }
  }

  render() {
    return html`<div role="list" class="ui-list hover gap-2">
        <div class="flex header border-bottom">
          <div class="w-8 md_w-10">Rank</div>
          <div class="flex-shrink">Collection</div>
          <div class="flex-auto"></div>
          <div class="num flex-auto w-32">${this.weekly ? `Volume` : html`Price`}</div>
        </div>
        ${when(
          this.pending && !this.subjectList,
          () => html` <loading-skeleton num="4"></loading-skeleton> `,
          () =>
            html`${repeat(
              this.subjectList,
              (item: any, i) => html`
                <div class="item flex items-center">
                  <div class="flex-none w-8 md_w-10 pl-2 text-sm font-light opacity-70">${i + 1}</div>
                  <div class="flex-shrink">
                    <img-loader
                      @click=${() => this.go2(item)}
                      .src=${item.image}
                      class="w-[3rem] h-[3rem] md_w-[3.75rem] md_h-[3.75rem] rounded-lg cursor-pointer"
                    ></img-loader>
                  </div>
                  <div class="flex-auto truncate">
                    <p class="name truncate cursor-pointer" @click=${() => this.go2(item)}>${item.name}</p>
                    <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                  </div>
                  <div class="num flex-initial flex flex-col !w-18 text-sm items-end">
                    <span>${this.weekly ? formatUnits(item.volumeTotal, 18) : (Number(item.supply) + 1) / 10}</span>
                    <span class="text-xs" style="color: #34C77B">${TopAlbum.dayChange(item)}</span>
                  </div>
                </div>
              `
            )}`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
