import { CCFloat, Component, Vec2, _decorator, game } from 'cc'
import EventManager from '../Runtimes/EventManger'
import { EVENT_TYPE_ENUM } from '../Enums'

const { ccclass, property } = _decorator

export enum SHAKE_DIRECTION {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export const SHAKE_DURATION = 100

@ccclass('ShakeManager')
export default class ShakeManager extends Component {
  private type: SHAKE_DIRECTION
  private oldTime = 0
  private isShaking = false
  private pos: Vec2 = new Vec2()

  @property(CCFloat)
  duration: number = SHAKE_DURATION

  @property(CCFloat)
  amount: number = 5

  @property(CCFloat)
  frequency: number = 12

  onLoad(): void {
    EventManager.instance.on(EVENT_TYPE_ENUM.SHAKE, this.onShake, this)
  }

  onDestroy(): void {
    EventManager.instance.off(EVENT_TYPE_ENUM.SHAKE, this.onShake)
  }

  stop() {
    this.isShaking = false
  }

  onShake(direction: SHAKE_DIRECTION) {
    if (this.isShaking) return
    this.type = direction
    this.oldTime = game.totalTime
    this.isShaking = true
    this.pos = new Vec2(this.node.position.x, this.node.position.y)
  }

  update() {
    if (!this.isShaking) return
    const current = (game.totalTime - this.oldTime) / 1000
    const total = this.duration / 1000
    const offset = this.amount * Math.sin(current * this.frequency * Math.PI)

    switch (this.type) {
      case SHAKE_DIRECTION.UP:
        this.node.setPosition(this.pos.x, this.pos.y + offset)
        break
      case SHAKE_DIRECTION.DOWN:
        this.node.setPosition(this.pos.x, this.pos.y - offset)
        break
      case SHAKE_DIRECTION.LEFT:
        this.node.setPosition(this.pos.x - offset, this.pos.y)
        break
      case SHAKE_DIRECTION.RIGHT:
        this.node.setPosition(this.pos.x + offset, this.pos.y)
        break
    }

    if (current >= total) {
      this.isShaking = false
      this.node.setPosition(this.pos.x, this.pos.y)
    }
  }
}
