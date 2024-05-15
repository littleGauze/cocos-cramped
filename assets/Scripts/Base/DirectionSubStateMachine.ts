import { DIRECTION_ENUM, FSM_PARAM_TYPE_ENUM } from '../Enums'
import SubStateMachine from './SubStateMachine'

export default abstract class DirectionSubStateMachine extends SubStateMachine {
  run() {
    const { value } = this.fsm.params.get(FSM_PARAM_TYPE_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ENUM[value as number])
  }
}
