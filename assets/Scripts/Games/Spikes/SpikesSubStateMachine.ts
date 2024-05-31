import { AnimationClip } from 'cc'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM, SPIKES_LOOP_NUMBER_ENUM } from '../../Enums'
import SubStateMachine from '../../Base/SubStateMachine'

const BASE_URL = 'texture/spikes'

type SpikesSubStateMachineType = 'spikesone' | 'spikestwo' | 'spikesthree' | 'spikesfour'

export default class SpikesSubStateMachine extends SubStateMachine {
  constructor(
    fsm: StateMachine,
    type: SpikesSubStateMachineType,
    mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    super(fsm)

    this.stateMachines.set(
      SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_0],
      new State(fsm, `${BASE_URL}/${type}/zero`, mode),
    )
    this.stateMachines.set(
      SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_1],
      new State(fsm, `${BASE_URL}/${type}/one`, mode),
    )
    this.stateMachines.set(
      SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_2],
      new State(fsm, `${BASE_URL}/${type}/two`, mode),
    )

    if (type !== 'spikesone') {
      this.stateMachines.set(
        SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_3],
        new State(fsm, `${BASE_URL}/${type}/two`, mode),
      )
    }

    if (type !== 'spikesone' && type !== 'spikestwo') {
      this.stateMachines.set(
        SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_4],
        new State(fsm, `${BASE_URL}/${type}/three`, mode),
      )
    }
    if (type === 'spikesfour') {
      this.stateMachines.set(
        SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_5],
        new State(fsm, `${BASE_URL}/${type}/four`, mode),
      )
    }
  }

  run(): void {
    const value = this.fsm.params.get(FSM_PARAM_TYPE_ENUM.SPIKES_CUR_COUNT).value
    switch (this.currentState) {
      case this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_0]):
      case this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_1]):
      case this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_2]):
      case this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_3]):
      case this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_4]):
      case this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_5]):
        if (value === SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_0) {
          this.currentState = this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_0])
        } else if (value === SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_1) {
          this.currentState = this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_1])
        } else if (value === SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_2) {
          this.currentState = this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_2])
        } else if (value === SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_3) {
          this.currentState = this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_3])
        } else if (value === SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_4) {
          this.currentState = this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_4])
        } else if (value === SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_5) {
          this.currentState = this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_5])
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(SPIKES_LOOP_NUMBER_ENUM[SPIKES_LOOP_NUMBER_ENUM.SPIKES_LOOP_0])
        break
    }
  }
}
