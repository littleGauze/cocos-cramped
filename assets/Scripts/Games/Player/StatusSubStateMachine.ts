import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State, { ANIMATION_SPEED } from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enums'
import { SHAKE_DIRECTION } from '../../UI/ShakeManger'

export default class StatusSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine, type: string, mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
    super(fsm)

    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.UP],
      new State(
        fsm,
        `texture/player/${type}/top`,
        mode,
        ANIMATION_SPEED,
        type === 'attack' ? [{ frame: ANIMATION_SPEED * 4, func: 'onAttackShake', params: [SHAKE_DIRECTION.UP] }] : [],
      ),
    )
    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.DOWN],
      new State(
        fsm,
        `texture/player/${type}/bottom`,
        mode,
        ANIMATION_SPEED,
        type === 'attack'
          ? [{ frame: ANIMATION_SPEED * 4, func: 'onAttackShake', params: [SHAKE_DIRECTION.DOWN] }]
          : [],
      ),
    )
    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.LEFT],
      new State(
        fsm,
        `texture/player/${type}/left`,
        mode,
        ANIMATION_SPEED,
        type === 'attack'
          ? [{ frame: ANIMATION_SPEED * 4, func: 'onAttackShake', params: [SHAKE_DIRECTION.LEFT] }]
          : [],
      ),
    )
    this.stateMachines.set(
      DIRECTION_ENUM[DIRECTION_ENUM.RIGHT],
      new State(
        fsm,
        `texture/player/${type}/right`,
        mode,
        ANIMATION_SPEED,
        type === 'attack'
          ? [{ frame: ANIMATION_SPEED * 4, func: 'onAttackShake', params: [SHAKE_DIRECTION.RIGHT] }]
          : [],
      ),
    )
  }
}
