import { ThemeElement, customElement } from '../shared/theme-element'
import { PlayPauseAbleElement } from './audioish'

@customElement('ui-audio')
export class UIAudeo extends PlayPauseAbleElement(ThemeElement(''), { tag: 'audio' }) {}
