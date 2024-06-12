import { RenderRoot2D, director, game } from 'cc'
import DrawManger, { FADE_DURATION } from '../UI/DrawManger'
import { createUINode } from '../Utils'
import Singleton from './Singleton'

export default class FaderManger extends Singleton {
  static get Instance() {
    return this.GetInstance<FaderManger>()
  }

  private _fader: DrawManger

  get fader() {
    if (!this._fader) {
      const root = createUINode()
      root.addComponent(RenderRoot2D)

      const fadeNode = createUINode('fade')
      fadeNode.setParent(root)
      this._fader = fadeNode.addComponent(DrawManger)
      this._fader.init()

      director.addPersistRootNode(root)
    }
    return this._fader
  }

  fadeIn(duration: number = FADE_DURATION) {
    this.fader.fadeIn(duration)
  }

  fadeOut(duration: number = FADE_DURATION) {
    this.fader.fadeOut(duration)
  }
}
