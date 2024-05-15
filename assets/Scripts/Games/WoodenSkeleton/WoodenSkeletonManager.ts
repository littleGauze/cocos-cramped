import { _decorator } from 'cc'
import EnemyManager from '../../Base/EnemyManager'
import { IEntity } from '../../Levels'
import WoodenSkeletonStateMachine from './WoodenSkeletonStateMachine'

const { ccclass } = _decorator

@ccclass('WoodenSkeletonManager')
export default class WoodenSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.node.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)
  }
}
