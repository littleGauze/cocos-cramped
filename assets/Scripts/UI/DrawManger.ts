import { BlockInputEvents, Color, Component, Graphics, UITransform, _decorator, game, view } from 'cc'

const { ccclass, property } = _decorator

export enum DrawState {
  IDLE,
  FADE_IN,
  FADE_OUT,
}

export const FADE_DURATION = 500

const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HEIGHT = view.getVisibleSize().height

@ccclass('DrawManger')
export default class DrawManger extends Component {
  private ctx: Graphics
  state: DrawState = DrawState.IDLE
  private oldTime: number = 0
  private duration: number = FADE_DURATION
  private block: BlockInputEvents

  fadeResolve: (value: null) => void

  init() {
    this.ctx = this.addComponent(Graphics)
    this.block = this.addComponent(BlockInputEvents)
    const uiTransform = this.getComponent(UITransform)
    uiTransform.setAnchorPoint(0.5, 0.5)
    uiTransform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)

    this.setAlpha(1)
  }

  setAlpha(percent: number) {
    this.ctx.clear()
    this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.ctx.fillColor = new Color(0, 0, 0, percent * 255)
    this.ctx.fill()
    this.block.enabled = percent === 1
  }

  update() {
    const percent = (game.totalTime - this.oldTime) / this.duration
    switch (this.state) {
      case DrawState.FADE_IN:
        if (percent < 1) {
          this.setAlpha(percent)
        } else {
          this.setAlpha(1)
          this.state = DrawState.IDLE
          this.fadeResolve(null)
        }
        break
      case DrawState.FADE_OUT:
        if (percent < 1) {
          this.setAlpha(1 - percent)
        } else {
          this.setAlpha(0)
          this.state = DrawState.IDLE
          this.fadeResolve(null)
        }
        break
      default:
        break
    }
  }

  fadeIn(duration: number = this.duration) {
    this.setAlpha(0)
    this.oldTime = game.totalTime
    this.duration = duration
    this.state = DrawState.FADE_IN
    return new Promise<null>(resolve => {
      this.fadeResolve = resolve
    })
  }

  fadeOut(duration: number = this.duration) {
    this.setAlpha(1)
    this.oldTime = game.totalTime
    this.duration = duration
    this.state = DrawState.FADE_OUT
    return new Promise<null>(resolve => {
      this.fadeResolve = resolve
    })
  }
}
