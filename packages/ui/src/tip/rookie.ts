import { screenStore } from '@lit-web3/base'
import { customElement, ThemeElement, html, when, state, property } from '../shared/theme-element'

import style from './rookie.css?inline'


@customElement('ui-tip-rookie')
export class UITipRookie extends ThemeElement(style) {

  @state() show = true

  @property({type: Boolean})
  open = false;

  close() {
    this.open = false;
  }

  render() {
    return html `
      ${when(
        screenStore.isMobi,
        () => html`
          <div>
            <p>mobile rookie tips</p>
          </div>
        `,
        () => html`
          <div class="backdrop">
            <div class="modal">
              <button class="close" @click="${this.close}">X</button>
              <p class="font-semibold text-xl mb-4 text-center">Come to RIFFIAN and earn $DOID!</p>
              <p class="content-text">You can claim rewards and get $DOID; </p>
              <p class="content-text">can vote for the content you like, and as long as it enters the weekly list, you can also get a share of the prize pool rewards; </p> 
              <p class="content-text">You can vote for the content you like at a low price, then wait for others to vote and then sell it to get the price difference.</p>
              <p class="content-text font-light">Come and play together!</p>
              <button class="play-button">Let's Play</button>
            </div>
          </div>
        `
      )}
    `
  }
}
