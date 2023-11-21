import { TailwindElement, customElement } from '../shared/TailwindElement'
import { PlayPauseAbleElement } from './audioish'

@customElement('ui-video')
export class UIVideo extends PlayPauseAbleElement(TailwindElement('')) {}
