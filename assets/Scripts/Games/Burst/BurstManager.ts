import { UITransform, _decorator } from 'cc'
import { EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM } from '../../Enums'
import { IEntity } from '../../Levels'
import EventManager from '../../Runtimes/EventManger'
import DataManager from '../../Runtimes/DataManager'
import EnemyManager from '../../Base/EnemyManager'
import BurstStateMachine from './BurstStateMachine'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager'

const { ccclass } = _decorator

@ccclass('BurstManager')
export default class BurstManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.node.addComponent(BurstStateMachine)
    await this.fsm.init()

    super.init(params)
    this.node.getComponent(UITransform).setContentSize(TILE_WIDTH, TILE_HEIGHT)

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.checkBurst, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.checkBurst)
  }

  checkBurst() {
    if (this.isDead && !DataManager.instance.player) return
    const { x: pX, y: pY } = DataManager.instance.player
    const onTop = pX === this.x && pY === this.y
    if (onTop && this.state === FSM_PARAM_TYPE_ENUM.IDLE) {
      this.state = FSM_PARAM_TYPE_ENUM.ATTACK
    } else if (this.state === FSM_PARAM_TYPE_ENUM.ATTACK) {
      this.state = FSM_PARAM_TYPE_ENUM.DEATH
      if (onTop) {
        EventManager.instance.emit(EVENT_TYPE_ENUM.PLAYER_AIRDEATH)
      }
    }
  }

  update(dt: number) {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }
}
