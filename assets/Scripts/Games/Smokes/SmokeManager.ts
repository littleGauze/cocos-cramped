import { _decorator } from 'cc'
import EnemyManager from '../../Base/EnemyManager'
import { IEntity } from '../../Levels'
import SmokeStateMacine from './SmokeStateMachine'

const { ccclass } = _decorator

@ccclass('SomkeManager')
export default class SmokeManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.node.addComponent(SmokeStateMacine)
    await this.fsm.init()

    super.init(params)
  }
}
