import { _decorator, Animation, Component, SpriteFrame } from 'cc'
import State from './State'
import { FSM_PARAM_TYPE_ENUM } from '../Enums'
import SubStateMachine from './SubStateMachine'

const { ccclass } = _decorator

export type FsmParamValueType = boolean | number

export interface IFsmParamValue {
  type: FSM_PARAM_TYPE_ENUM
  value: FsmParamValueType
}

export const getInitTriggerParams = () => ({
  type: FSM_PARAM_TYPE_ENUM.TRIGGER,
  value: false,
})

export const getInitNumberParams = () => ({
  type: FSM_PARAM_TYPE_ENUM.NUMBER,
  value: 0,
})

@ccclass('StateMachine')
export default abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine = null
  animationComponent: Animation = null
  waitingList: Array<Promise<SpriteFrame[]>> = []
  params: Map<string, IFsmParamValue> = new Map()
  stateMachines: Map<string, State | SubStateMachine> = new Map()

  getParams(name: string) {
    if (this.params.has(name)) {
      return this.params.get(name).value
    }
  }

  setParams(name: string, value: FsmParamValueType) {
    if (this.params.has(name)) {
      this.params.get(name).value = value
      this.run()
      this.resetTrigger()
    }
  }

  get currentState() {
    return this._currentState
  }

  set currentState(state: State | SubStateMachine) {
    this._currentState = state
    this._currentState.run()
  }

  resetTrigger() {
    for (const [, value] of this.params) {
      if (value.type === FSM_PARAM_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    }
  }

  abstract init(): void

  abstract run(): void
}
