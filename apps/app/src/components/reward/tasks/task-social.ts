import { ThemeElement, customElement, html, when, state, classMap } from '@riffian-web/ui/shared/theme-element'
import { StateController, tweetStore } from '~/store/tweet'
// Components
import '~/components/bind-social'

@customElement('task-social')
export class TaskSocial extends ThemeElement('') {
  bindTweets: any = new StateController(this, tweetStore)

  back = () => {
    this.emit('back')
  }

  render() {
    return html`<bind-social @back=${this.back}></bind-social> `
  }
}
