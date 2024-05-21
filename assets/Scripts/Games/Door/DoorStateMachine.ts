import { _decorator, Animation, AnimationClip } from 'cc'
import StateMachine, { getInitNumberParams, getInitTriggerParams } from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM } from '../../Enums'
import DoorSubStateMachine from './DoorSubStateMachine'

const { ccclass } = _decorator

@ccclass('DoorStateMachine')
export default class DoorStateMachine extends StateMachine {
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
    this.params.set(FSM_PARAM_TYPE_ENUM.DEATH, getInitTriggerParams())
  }

  initStateMachines() {
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.IDLE, new DoorSubStateMachine(this, 'idle', AnimationClip.WrapMode.Loop))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.DEATH, new DoorSubStateMachine(this, 'death'))
  }

  initAnimationEvent() {}

  run(): void {
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.DEATH):
        if (this.params.get(FSM_PARAM_TYPE_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE)
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
