import {
  ThemeElement,
  classMap,
  customElement,
  html,
  property,
  repeat,
  state,
  when
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
// import '~/components/top/dialog'
import { albumList } from './action'
import { screenStore } from '@lit-web3/base/screen'
import { weeklyStore } from '~/store/weekly'
import { goto } from '@lit-web3/router'
import { isImage } from '@lit-web3/base/MIMETypes'
// Components
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import '@riffian-web/ui/pagination'

import emitter from '@lit-web3/base/emitter'
import { formatUnits } from 'ethers'
import { MEDIA_URL_DEFAULTS, paginationDef } from '~/utils'
import type { Pagination } from '~/utils'

import style from './list.css?inline'
@customElement('top-album')
export class TopAlbum extends ThemeElement(style) {
  indScreen: any = new StateController(this, screenStore)
  bindBridge: any = new StateController(this, bridgeStore)
  bindWeekly: any = new StateController(this, weeklyStore)

  @property({ type: Boolean }) paging = false
  @state() subjectList: any = []
  @state() showAlbumVote = false
  @state() albumToVote = { id: '', supply: 0, url: '', name: '', creator: { address: '' }, uri: '', image: '' }
  @state() pending = false
  // @state() prompt = false
  // @state() promptMessage: string = ''
  @state() pagination = paginationDef() as Paging
  @state() hasMore = true

  get disabled() {
    return !bridgeStore.bridge.account
  }
  get isMobi() {
    return screenStore.isMobi
  }
  get scrollMode() {
    return this.isMobi ? 'click' : 'scroll'
  }

  async connectedCallback() {
    super.connectedCallback()
    this.fetch(true)
    emitter.on('toplist-fetch', () => {
      // this.pagination = paginationDef()
      this.fetch(force)
    })
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  fetch = async (force = false) => {
    if (this.paging && !this.hasMore) return
    this.pending = true
    try {
      const opts = {}
      if (this.pagination) {
        const { pageSize, pageNum } = this.pagination
        Object.assign(opts, { first: pageSize, skip: (pageNum - 1) * pageSize })
      }
      let { subjects } = await albumList(opts)
      const _subjects = subjects.map((item: any) => ({
        ...item,
        image: item.image?.startsWith(`http`) ? item.image : MEDIA_URL_DEFAULTS[0]
      }))
      if (this.paging) {
        this.subjectList.push(..._subjects)
        this.hasMore = subjects.length >= this.pagination.pageSize
        this.pagination.pageNum++
      } else {
        this.subjectList = [..._subjects]
      }
    } catch (e: any) {
      console.error(e)
      // this.promptMessage = e
      // this.prompt = true
      return
    } finally {
      this.pending = false
    }
  }

  // close = () => {
  //   this.showAlbumVote = false
  //   this.fetch()
  // }
  loaded = () => {
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
    return html`<div role="list" class="ui-list gap-2 ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
        <div class="flex header border-bottom">
          <div class="w-8 md_w-10">Rank</div>
          <div class="flex-shrink">Collection</div>
          <div class="flex-auto"></div>
          <div class="num flex-auto w-32">${this.weekly ? `Volume` : html`Price`}</div>
        </div>
        ${when(
          this.pending && !this.subjectList,
          () => html`<div name="loading" class="doc-intro"></div><loading-skeleton num="4"></loading-skeleton></div>`,
          () =>
            html`${repeat(
                this.subjectList,
                (item: any, i) => html`
                  <div class="item flex items-center">
                    <div class="flex-none w-8 md_pl-3 text-sm font-light opacity-70">${i + 1}</div>
                    <div class="flex-shrink">
                      <img-loader
                        @click=${() => this.go2(item)}
                        .src=${item.image}
                        class="w-[3rem] h-[3rem] md_w-[3.75rem] md_h-[3.75rem] rounded-lg cursor-pointer"
                      ></img-loader>
                    </div>
                    <div class="flex-auto truncate">
                      <p class="name truncate cursor-pointer" @click=${() => this.go2(item)}>${item.name}</p>
                      <a href=${item.uri} target="_blank">
                        <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                      </a>
                    </div>
                    <div class="num flex-initial flex flex-col !w-18 text-sm items-end">
                      <span>${this.weekly ? formatUnits(item.volumeTotal, 18) : (Number(item.supply) + 1) / 10}</span>
                      <span class="text-xs" style="color: #34C77B">${TopAlbum.dayChange(item)}</span>
                    </div>
                  </div>
                `
              )}
              <ui-pagination
                mode=${this.scrollMode}
                .firstLoad=${false}
                .pending=${this.pending}
                @loadmore=${this.loaded}
              ></ui-pagination> `
        )}
      </div>
      <!-- Prompt -->
      <!-- ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p>`)} --> `
  }
}
