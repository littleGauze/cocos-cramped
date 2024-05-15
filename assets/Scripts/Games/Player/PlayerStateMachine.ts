import { _decorator, Animation } from 'cc'
import StateMachine, { getInitNumberParams, getInitTriggerParams } from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM } from '../../Enums'
import PlayerIdleSubStateMachine from './PlayerIdleSubStateMachine'
import PlayerTurnLeftSubStateMachine from './PlayerTurnLeftSubStateMachine'
import EntityManager from '../../Base/EntityManager'

const { ccclass } = _decorator

@ccclass('PlayerStateMachine')
export default class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(FSM_PARAM_TYPE_ENUM.IDLE, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.TURN_LEFT, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.DIRECTION, getInitNumberParams())
  }

  initStateMachines() {
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.IDLE, new PlayerIdleSubStateMachine(this))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.TURN_LEFT, new PlayerTurnLeftSubStateMachine(this))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const whilelist = ['block', 'turn', 'attack']
      const name = this.animationComponent.defaultClip.name
      if (whilelist.includes(name)) {
        this.node.getComponent(EntityManager).state = FSM_PARAM_TYPE_ENUM.IDLE
      }
    })
  }

  run(): void {
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.TURN_LEFT):
        if (this.params.get(FSM_PARAM_TYPE_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.TURN_LEFT)
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
