import { _decorator } from 'cc'
import { DIRECTION_ENUM, EVENT_TYPE_ENUM } from '../Enums'
import { IEntity } from '../Levels'
import DataManager from '../Runtimes/DataManager'
import EventManager from '../Runtimes/EventManger'
import EntityManager from './EntityManager'

const { ccclass } = _decorator

@ccclass('EnemyManager')
export default class EnemyManager extends EntityManager {
  init(params: IEntity) {
    super.init(params)

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
  }

  onDestroy() {
    super.onDestroy()

    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_BORN, this.onChangeDirection)
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
  }

  onChangeDirection(init = false) {
    const { x: pX, y: pY } = DataManager.instance.player
    const disX = Math.abs(pX - this.x)
    const disY = Math.abs(pY - this.y)

    if (disX === disY && !init) return

    if (pX >= this.x && pY <= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.UP
    } else if (pX <= this.x && pY <= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.UP
    } else if (pX <= this.x && pY >= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.DOWN
    } else if (pX >= this.x && pY >= this.y) {
      this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.DOWN
    }
  }
}
