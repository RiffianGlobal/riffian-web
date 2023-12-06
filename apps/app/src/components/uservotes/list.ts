import { TailwindElement, customElement, html, repeat, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import './dialog'
import { userVotes } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '~/components/rewards/claim'
import { formatUnits } from 'ethers'

@customElement('user-votes-list')
export class UserVotesList extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() userVotes: any = []
  @state() dialog = false
  @state() currentAlbum = { id: '', votes: 0, url: '' }
  @state() pending = false

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
    let result = await userVotes(bridgeStore.bridge.account)
    this.userVotes = result.userVotes
    this.pending = false
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
            </div>
          </div>`
      )}
      ${when(
        !this.pending,
        () =>
          html`<table class="w-full text-left border-collapse">
            <thead>
              <th>Collection</th>
              <th>Name</th>
              <th>Author</th>
              <th>Revocable Value</th>
              <th>Votes</th>
              <th>Operation</th>
            </thead>
            ${repeat(
              this.userVotes,
              (item: any) =>
                html`<tr>
                  <td>
                    <p class="w-24 h-24 rounded-md">
                      <img-loader src=${item.subject.image} loading="lazy"></img-loader>
                    </p>
                  </td>
                  <td class="py-2 pl-2 text-lg leading-6 whitespace-pre dark:text-indigo-300 font-sans">
                    ${item.subject.name}
                  </td>
                  <td><ui-address .address="${item.subject.owner.account}" short avatar></ui-address></td>
                  <td><p class="text-sm font-bold font-sans">${formatUnits(item.value, 18)} FTM</p></td>
                  <td><p class="text-lg font-bold text-sky-500 font-sans">${item.supply}</p></td>
                  <td>
                    <div name="Dialog" class="doc-intro">
                      <ui-button
                        class="outlined"
                        ?disabled="${this.disabled}"
                        @click=${() => {
                          this.currentAlbum = item
                          this.dialog = true
                        }}
                        >RETREAT</ui-button
                      >
                      ${when(
                        this.dialog && item.id == this.currentAlbum.id,
                        () =>
                          html`<retreat-vote-dialog
                            album=${item.subject.id}
                            url=${item.subject.image}
                            votes=${item.subject.votes}
                            @close=${this.close}
                          ></retreat-vote-dialog>`
                      )}
                    </div>
                  </td>
                </tr> `
            )}
          </table>`
      )}
    </div>`
  }
}
