import { ThemeElement, customElement } from '../shared/theme-element'
import { PlayPauseAbleElement } from './audioish'

@customElement('ui-video')
export class UIVideo extends PlayPauseAbleElement(ThemeElement('')) {}
