import { _decorator } from 'cc'
import EnemyManager from '../../Base/EnemyManager'
import { EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM } from '../../Enums'
import { IEntity } from '../../Levels'
import DataManager from '../../Runtimes/DataManager'
import EventManager from '../../Runtimes/EventManger'
import WoodenSkeletonStateMachine from './WoodenSkeletonStateMachine'

const { ccclass } = _decorator

@ccclass('WoodenSkeletonManager')
export default class WoodenSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.node.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  onDestroy() {
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.onAttack)
  }

  onAttack() {
    const { x: pX, y: pY, state } = DataManager.instance.player

    if ((pX === this.x && Math.abs(pY - this.y) <= 1) || (pY === this.y && Math.abs(pX - this.x) <= 1)) {
      this.state = FSM_PARAM_TYPE_ENUM.ATTACK
      EventManager.instance.emit(EVENT_TYPE_ENUM.PLAYER_DEATH)
    } else {
      this.state = FSM_PARAM_TYPE_ENUM.IDLE
    }
  }
}
