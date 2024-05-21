import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enums'

const BASE_URL = 'texture/door'

export type DoorResourceType = 'idle' | 'death'

export default class DoorSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine, type: DoorResourceType, mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
    super(fsm)

    const isDeath = type === 'death'
    const name = isDeath ? `${BASE_URL}/death` : ''

    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.UP],
      new State(fsm, isDeath ? name : `${BASE_URL}/${type}/top`, mode),
    )
    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.DOWN],
      new State(fsm, isDeath ? name : `${BASE_URL}/${type}/top`, mode),
    )
    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.LEFT],
      new State(fsm, isDeath ? name : `${BASE_URL}/${type}/left`, mode),
    )
    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.RIGHT],
      new State(fsm, isDeath ? name : `${BASE_URL}/${type}/left`, mode),
    )
  }
}
