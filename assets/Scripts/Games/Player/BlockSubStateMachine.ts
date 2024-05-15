import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enums'

export default class BlockSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine, type: string) {
    super(fsm)

    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.UP], new State(fsm, `texture/player/${type}/top`))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.DOWN], new State(fsm, `texture/player/${type}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.LEFT], new State(fsm, `texture/player/${type}/left`))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.RIGHT], new State(fsm, `texture/player/${type}/right`))
  }
}
