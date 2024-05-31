import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enums'

const BASE_URL = 'texture'

export type WoodenSkeletonResourceType = 'idle' | 'death'

export default class SmokeSubStateMachine extends DirectionSubStateMachine {
  constructor(
    fsm: StateMachine,
    type: WoodenSkeletonResourceType,
    mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    super(fsm)

    if (type === 'idle') {
      this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.UP], new State(fsm, `${BASE_URL}/smoke/${type}/top`, mode))
      this.stateMachines.set(
        DIRECTION_ENUM[DIRECTION_ENUM.DOWN],
        new State(fsm, `${BASE_URL}/smoke/${type}/bottom`, mode),
      )
      this.stateMachines.set(
        DIRECTION_ENUM[DIRECTION_ENUM.LEFT],
        new State(fsm, `${BASE_URL}/smoke/${type}/left`, mode),
      )
      this.stateMachines.set(
        DIRECTION_ENUM[DIRECTION_ENUM.RIGHT],
        new State(fsm, `${BASE_URL}/smoke/${type}/right`, mode),
      )
    } else {
      this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.UP], new State(fsm, `${BASE_URL}/door/${type}`, mode))
      this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.DOWN], new State(fsm, `${BASE_URL}/door/${type}`, mode))
      this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.LEFT], new State(fsm, `${BASE_URL}/door/${type}`, mode))
      this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.RIGHT], new State(fsm, `${BASE_URL}/door/${type}`, mode))
    }
  }
}
