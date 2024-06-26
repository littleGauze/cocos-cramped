import { _decorator, Animation, AnimationClip } from 'cc'
import StateMachine, { getInitNumberParams, getInitTriggerParams } from '../../Base/StateMachine'
import { EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM } from '../../Enums'
import EntityManager from '../../Base/EntityManager'
import WoodenSkeletonSubStateMachine from './WoodenSkeletonSubStateMachine'
import EventManager from '../../Runtimes/EventManger'

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
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.ATTACK, new WoodenSkeletonSubStateMachine(this, 'attack'))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.DEATH, new WoodenSkeletonSubStateMachine(this, 'death'))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const whilelist = ['attack']
      const name = this.animationComponent.defaultClip.name
      if (whilelist.some(v => name.includes(v))) {
        this.node.getComponent(EntityManager).state = FSM_PARAM_TYPE_ENUM.IDLE
      }
      if (name.includes('death')) {
        EventManager.instance.emit(EVENT_TYPE_ENUM.CHECK_DOOR_OPEN)
      }
    })
  }

  run(): void {
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.ATTACK):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.DEATH):
        if (this.params.get(FSM_PARAM_TYPE_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.ATTACK)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.DEATH)
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
