import { _decorator, Animation, AnimationClip } from 'cc'
import StateMachine, { getInitNumberParams, getInitTriggerParams } from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM } from '../../Enums'
import State from '../../Base/State'

const { ccclass } = _decorator

const BASE_URL = 'texture/burst'

@ccclass('BurstStateMachine')
export default class BurstStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(FSM_PARAM_TYPE_ENUM.IDLE, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.DEATH, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.ATTACK, getInitTriggerParams())
  }

  initStateMachines() {
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.IDLE, new State(this, `${BASE_URL}/idle`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.ATTACK, new State(this, `${BASE_URL}/attack`))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.DEATH, new State(this, `${BASE_URL}/death`))
  }

  initAnimationEvent() {}

  run(): void {
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.DEATH):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.ATTACK):
        if (this.params.get(FSM_PARAM_TYPE_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.DEATH)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.ATTACK)
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
