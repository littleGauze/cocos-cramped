import { _decorator, Animation } from 'cc'
import StateMachine, { getInitNumberParams, getInitTriggerParams } from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM } from '../../Enums'
import EntityManager from '../../Base/EntityManager'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import TurnRightSubStateMachine from './TurnRightSubStateMachine'
import BlockSubStateMachine from './BlockSubStateMachine'
import StatusSubStateMachine from './StatusSubStateMachine'
import DataManager from '../../Runtimes/DataManager'

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
    this.params.set(FSM_PARAM_TYPE_ENUM.DIRECTION, getInitNumberParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.IDLE, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.TURN_LEFT, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.TURN_RIGHT, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.BLOCKFRONT, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.BLOCKBACK, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.DEATH, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.AIRDEATH, getInitTriggerParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.ATTACK, getInitTriggerParams())
  }

  initStateMachines() {
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.TURN_LEFT, new TurnLeftSubStateMachine(this))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.TURN_RIGHT, new TurnRightSubStateMachine(this))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.BLOCKFRONT, new BlockSubStateMachine(this, 'blockfront'))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.BLOCKBACK, new BlockSubStateMachine(this, 'blockback'))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT, new BlockSubStateMachine(this, 'blockturnleft'))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT, new BlockSubStateMachine(this, 'blockturnright'))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.DEATH, new StatusSubStateMachine(this, 'death'))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.AIRDEATH, new StatusSubStateMachine(this, 'airdeath'))
    this.stateMachines.set(FSM_PARAM_TYPE_ENUM.ATTACK, new StatusSubStateMachine(this, 'attack'))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const whilelist = ['block', 'turn', 'attack']
      const name = this.animationComponent.defaultClip.name
      if (whilelist.some(v => name.includes(v))) {
        this.node.getComponent(EntityManager).state = FSM_PARAM_TYPE_ENUM.IDLE
      }
    })
  }

  run(): void {
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.TURN_LEFT):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.TURN_RIGHT):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKFRONT):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKBACK):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.DEATH):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.AIRDEATH):
      case this.stateMachines.get(FSM_PARAM_TYPE_ENUM.ATTACK):
        if (this.params.get(FSM_PARAM_TYPE_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.IDLE)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.TURN_LEFT)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.TURN_RIGHT)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.BLOCKFRONT).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKFRONT)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.BLOCKBACK).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKBACK)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.DEATH)
        } else if (this.params.get(FSM_PARAM_TYPE_ENUM.AIRDEATH).value) {
          this.currentState = this.stateMachines.get(FSM_PARAM_TYPE_ENUM.AIRDEATH)
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
