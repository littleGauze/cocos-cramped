import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enums'

export default class StatusSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine, type: string, mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
    super(fsm)

    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.UP], new State(fsm, `texture/player/${type}/top`, mode))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.DOWN], new State(fsm, `texture/player/${type}/bottom`, mode))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.LEFT], new State(fsm, `texture/player/${type}/left`, mode))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.RIGHT], new State(fsm, `texture/player/${type}/right`, mode))
  }
}
