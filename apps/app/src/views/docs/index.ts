import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/connect-wallet/btn'
import '@riffian-web/ui-docs/src'
import fetchJsonP from 'fetch-jsonp'

// Style
@customElement('view-docs')
export class ViewDocs extends TailwindElement('') {
  async connectedCallback() {
    super.connectedCallback()
    const { html, author_name: nick } = await (
      await fetchJsonP(
        `https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2Felonmusk%2Fstatus%2F1732545299044843647`
      )
    ).json()
    const message = html.match(new RegExp(`<p lang="en" dir="ltr">(.*?)</p>&mdash;`))[1]
    console.log({ message, nick })
  }
  render() {
    return html`<div class="ui-container"><ui-docs></ui-docs></div>`
  }
}
