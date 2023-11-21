import { TailwindElement, customElement } from '../shared/TailwindElement'
import { PlayPauseAbleElement } from './audioish'

@customElement('ui-audio')
export class UIAudeo extends PlayPauseAbleElement(TailwindElement(''), { tag: 'audio' }) {}
