import {
  TailwindElement,
  customElement,
  html,
  repeat,
  property,
  state,
  when,
  queryAll
} from '@riffian-web/ui/src/shared/TailwindElement'

@customElement('top-album')
export class NewAlbum extends TailwindElement('') {
  @property({ type: Array }) albumList = []
  init = () => {
    var list: any = []
    list.push({
      address: '0xD9bDD17b3a77a24A8d40934e537a4B1e0f9235A8',
      url: 'https://i1.sndcdn.com/artworks-000329038545-d554xk-t500x500.jpg',
      price: 0.1,
      votes: 'loading...',
      desc: '"Beat It" is a song by American singer Michael Jackson from his sixth studio album, Thriller (1982)',
      name: 'Beat it'
    })
    list.push({
      address: '0xD9bDD17b3a77a24A8d40934e537a4B1e0f9235A8',
      url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/You_Are_Not_Alone.jpg/220px-You_Are_Not_Alone.jpg',
      price: 0.2,
      votes: 'loading...',
      desc: '"You Are Not Alone" is a pop and R&B ballad about love and isolation',
      name: 'You Are Not Alone'
    })
    this.albumList = list
  }

  vote = async (item: JSON) => {
    console.log(item)
  }

  render() {
    this.init()
    console.log(this.albumList)
    return html` <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
      <ul class="connect-wallet-list">
        ${repeat(
          this.albumList,
          (item, i) =>
            html`<li>
              <table>
                <tr>
                  <p class="my-2 font-bold text-lg">${i + 1}.${item.name}</p>
                </tr>
                <tr>
                  <td colspan="2"><img class="w-36 h-36" src=${item.url} /></td>
                  <td>${item.desc}</td>
                </tr>
                <tr>
                  <td>
                    <span>
                      <p class="text-sm text-gray-500">price</p>
                      <p class="text-sm font-bold text-sky-500">${item.price} FT</p>
                    </span>
                  </td>
                  <td>
                    <ui-button
                      value=${i}
                      class="m-1"
                      @click=${() => {
                        this.vote(item)
                      }}
                    >
                      VOTE
                    </ui-button>
                  </td>
                  <td></td>
                </tr>
              </table>
              <!-- <i class="mdi mdi-arrow-right"></i> -->
            </li>`
        )}
      </ul>
    </div>`
  }
}
