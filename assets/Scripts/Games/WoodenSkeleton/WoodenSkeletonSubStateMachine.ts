import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enums'

const BASE_URL = 'texture/woodenskeleton'

export type WoodenSkeletonResourceType = 'idle' | 'death' | 'attack'

export default class WoodenSkeletonSubStateMachine extends DirectionSubStateMachine {
  constructor(
    fsm: StateMachine,
    type: WoodenSkeletonResourceType,
    mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    super(fsm)

    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.UP], new State(fsm, `${BASE_URL}/${type}/top`, mode))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.DOWN], new State(fsm, `${BASE_URL}/${type}/bottom`, mode))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.LEFT], new State(fsm, `${BASE_URL}/${type}/left`, mode))
    this.stateMachines.set(DIRECTION_ENUM[DIRECTION_ENUM.RIGHT], new State(fsm, `${BASE_URL}/${type}/right`, mode))
  }
}
