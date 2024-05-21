import { _decorator } from 'cc'
import EnemyManager from '../../Base/EnemyManager'
import { EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM } from '../../Enums'
import { IEntity } from '../../Levels'
import DataManager from '../../Runtimes/DataManager'
import EventManager from '../../Runtimes/EventManger'
import WoodenSkeletonStateMachine from './IronSkeletonStateMachine'

const { ccclass } = _decorator

@ccclass('IronSkeletonManager')
export default class IronSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.node.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_ATTACK, this.onDeath, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_ATTACK, this.onDeath)
  }
}
