import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enums'

const BASE_URL = 'texture/player/turnleft'

export default class TurnLeftSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.UP], new State(fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.DOWN], new State(fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.LEFT], new State(fsm, `${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.RIGHT], new State(fsm, `${BASE_URL}/right`))
  }
}
