import { TailwindElement, customElement, html, repeat, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { albumList } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/dialog/prompt'
import '~/components/rewards/claim'
import emitter from '@riffian-web/core/src/emitter'

@customElement('top-album')
export class NewAlbum extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() albumList: any = []
  @state() dialog = false
  @state() currentAlbum = { id: '', votes: 0, url: '' }
  @state() pending = false
  @state() prompt = false
  @state() promptMessage: string = ''

  get disabled() {
    return !bridgeStore.bridge.account
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  init = async () => {
    this.pending = true
    let result
    try {
      result = await albumList(10)
      this.albumList = result.subjects
    } catch (e: any) {
      this.promptMessage = e
      this.prompt = true
    }
    console.log(this.albumList)
    this.pending = false

    let names = ['Beat it', 'You are not alone']
    let urls = [
      'https://m.media-amazon.com/images/M/MV5BMTA5NDBkNzMtNzY3NC00NDhiLWI2OGQtNmU2NGRmMzk3YjdiXkEyXkFqcGdeQXVyMjI0OTk0OTE@._V1_.jpg',
      'https://i1.sndcdn.com/artworks-000329038545-d554xk-t500x500.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/You_Are_Not_Alone.jpg/220px-You_Are_Not_Alone.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLE1c3OU9GZU5Ev_eXLBzyesTY8JOkUulBUw&usqp=CAU',
      'https://upload.wikimedia.org/wikipedia/zh/5/5e/21_Adele_Album.jpg',
      'https://i.kfs.io/album/global/25572377,4v1/fit/500x500.jpg'
    ]
    for (var i = 0; i < this.albumList.length; i++) {
      this.albumList[i].url = urls[this.getRandomInt(4)]
      // this.albumList[i].name = names[this.getRandomInt(2)]
    }
  }

  close = () => (this.dialog = false)

  render() {
    return html` <div class="grid place-items-center b-1 m-4 p-4 rounded-md">
        ${when(
          this.pending,
          () =>
            html`<div name="Loading" class="doc-intro">
              <div class="flex flex-col gap-8 m-8">
                <loading-skeleton num="3"></loading-skeleton>
                <loading-skeleton num="3"></loading-skeleton>
                <loading-skeleton num="3"></loading-skeleton>
              </div>
            </div>`
        )}
        ${when(
          !this.pending,
          () =>
            html`<table class="w-full text-left border-collapse">
              <thead>
                <th>Rank</th>
                <th>Author</th>
                <th>Collection</th>
                <th>Album</th>
                <th>Total Votes</th>
                <th>Operation</th>
              </thead>
              ${repeat(
                this.albumList,
                (item: any, i) =>
                  html`<tr>
                    <td
                      class="py-2 pr-2 font-sans	font-medium text-lg leading-6 text-sky-500 whitespace-nowrap dark:text-sky-400"
                    >
                      ${i + 1}
                    </td>
                    <td><ui-address .address="${item.owner.account}" short avatar></ui-address></td>
                    <td>
                      <p class="w-24 h-24 rounded-md">
                        <img-loader src=${item.url}></img-loader>
                      </p>
                    </td>
                    <td class="py-2 pl-2 text-lg leading-6 whitespace-pre dark:text-indigo-300 font-sans	">
                      ${item.name}
                    </td>
                    <td><p class="text-lg font-bold text-sky-500 font-sans">${item.totalVotes}</p></td>
                    <td>
                      <div name="Dialog" class="doc-intro">
                        <ui-button
                          class="outlined"
                          @click=${() => {
                            if (this.disabled) {
                              emitter.emit('connect-wallet')
                            } else {
                              this.currentAlbum = item
                              this.dialog = true
                            }
                          }}
                          >VOTE</ui-button
                        >
                        ${when(
                          this.dialog && item.id == this.currentAlbum.id,
                          () =>
                            html`<vote-album-dialog
                              album=${item.id}
                              url=${item.url}
                              votes=${item.votes}
                              @close=${this.close}
                            ></vote-album-dialog>`
                        )}
                      </div>
                    </td>
                  </tr> `
              )}
            </table>`
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html` <p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
