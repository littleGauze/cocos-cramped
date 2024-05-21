import { _decorator } from 'cc'
import EntityManager from '../../Base/EntityManager'
import { EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM } from '../../Enums'
import { IEntity } from '../../Levels'
import EventManager from '../../Runtimes/EventManger'
import DoorStateMachine from './DoorStateMachine'
import DataManager from '../../Runtimes/DataManager'

const { ccclass } = _decorator

@ccclass('DoorManager')
export default class DoorManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.node.addComponent(DoorStateMachine)
    await this.fsm.init()

    super.init(params)

    EventManager.instance.on(EVENT_TYPE_ENUM.CHECK_DOOR_OPEN, this.checkOpen, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.instance.off(EVENT_TYPE_ENUM.CHECK_DOOR_OPEN, this.checkOpen)
  }

  checkOpen() {
    if (DataManager.instance.enemies.every(enemy => enemy.isDead)) {
      this.state = FSM_PARAM_TYPE_ENUM.DEATH
    }
  }
}
