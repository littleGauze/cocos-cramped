import { Vec2, _decorator } from 'cc'
import { DIRECTION_ENUM, EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM, PLAYER_ACTION_ENUM } from '../../Enums'
import EventManager from '../../Runtimes/EventManger'
import EntityManager from '../../Base/EntityManager'
import { IEntity } from '../../Levels'
import PlayerStateMachine from './PlayerStateMachine'

const { ccclass } = _decorator

@ccclass('PlayerManager')
export default class PlayerManager extends EntityManager {
  private readonly speed: number = 1 / 10

  targetX: number = 0
  targetY: number = 0

  start() {}

  async init(params: IEntity) {
    this.fsm = this.node.addComponent(PlayerStateMachine)
    await this.fsm.init()

    super.init(params)
    this.targetX = params.x
    this.targetY = params.y

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_CTRL, this.move, this)
  }

  onDestroy() {
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_CTRL, this.move)
  }

  update(dt: number) {
    super.update(dt)
    this.updatePos(dt)
  }

  updatePos(dt: number) {
    if (this.x < this.targetX) {
      this.x += this.speed
    } else if (this.x > this.targetX) {
      this.x -= this.speed
    }

    if (this.y < this.targetY) {
      this.y += this.speed
    } else if (this.y > this.targetY) {
      this.y -= this.speed
    }

    if (Math.abs(this.targetX - this.x) < 0.1 && Math.abs(this.targetY - this.y) < 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  move(type: PLAYER_ACTION_ENUM) {
    switch (type) {
      case PLAYER_ACTION_ENUM.MOVE_LEFT:
        this.targetX -= 1
        break
      case PLAYER_ACTION_ENUM.MOVE_RIGHT:
        this.targetX += 1
        break
      case PLAYER_ACTION_ENUM.MOVE_UP:
        this.targetY -= 1
        break
      case PLAYER_ACTION_ENUM.MOVE_DOWN:
        this.targetY += 1
        break
      case PLAYER_ACTION_ENUM.TURN_LEFT:
        if (this.direction === DIRECTION_ENUM.UP) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.DOWN
        } else if (this.direction === DIRECTION_ENUM.DOWN) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.UP
        }
        this.state = FSM_PARAM_TYPE_ENUM.TURN_LEFT
        break
      case PLAYER_ACTION_ENUM.TURN_RIGHT:
        break
      default:
        break
    }
  }
}
