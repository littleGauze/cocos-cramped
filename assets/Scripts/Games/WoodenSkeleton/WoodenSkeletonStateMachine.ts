import { _decorator, Animation, AnimationClip } from 'cc'
import StateMachine, { getInitNumberParams, getInitTriggerParams } from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM } from '../../Enums'
import EntityManager from '../../Base/EntityManager'
import WoodenSkeletonSubStateMachine from './WoodenSkeletonSubStateMachine'

const { ccclass } = _decorator

@ccclass('WoodenSkeletonStateMachine')
export default class WoodenSkeletonStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(FSM_PARAM_TYPE_ENUM.DIRECTION, getInitNumberParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.IDLE, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.ATTACK, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.DEATH, getInitTriggerParams())
  }

  initStateMachines() {
    this.stateMachines.set(
      FSM_PARAM_TYPE_ENUM.IDLE,
      new WoodenSkeletonSubStateMachine(this, 'idle', AnimationClip.WrapMode.Loop),
    )
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const whilelist = ['attack']
      const name = this.animationComponent.defaultClip.name
      if (whilelist.includes(name)) {
        this.node.getComponent(EntityManager).state = FSM_PARAM_TYPE_ENUM.IDLE
      }
    })
  }

  run(): void {
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE):
        if (this.params.get(FSM_PARAM_TYPE_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE)
        break
    }
  }
}
