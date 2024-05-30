import { AnimationClip } from 'cc'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM, SPIKES_TYPE_ENUM } from '../../Enums'
import SubStateMachine from '../../Base/SubStateMachine'

const BASE_URL = 'texture/spikes'

type SpikesSubStateMachineType = 'spikesone' | 'spikestwo' | 'spikesthree' | 'spikesfour'

export default class SpikesSubStateMachine extends SubStateMachine {
  constructor(
    fsm: StateMachine,
    type: SpikesSubStateMachineType,
    mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Loop,
  ) {
    super(fsm)

    this.stateMachines.set(
      SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_0],
      new State(fsm, `${BASE_URL}/${type}/zero`, mode),
    )
    this.stateMachines.set(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_1], new State(fsm, `${BASE_URL}/${type}/one`, mode))
    this.stateMachines.set(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_2], new State(fsm, `${BASE_URL}/${type}/two`, mode))

    if (type !== 'spikesone') {
      this.stateMachines.set(
        SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_3],
        new State(fsm, `${BASE_URL}/${type}/two`, mode),
      )
    }

    if (type !== 'spikesone' && type !== 'spikestwo') {
      this.stateMachines.set(
        SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_4],
        new State(fsm, `${BASE_URL}/${type}/three`, mode),
      )
    }
    if (type === 'spikesfour') {
      this.stateMachines.set(
        SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_5],
        new State(fsm, `${BASE_URL}/${type}/four`, mode),
      )
    }
  }

  run(): void {
    const value = this.fsm.params.get(FSM_PARAM_TYPE_ENUM.SPIKES_CUR_COUNT).value
    console.log('SpikesSubStateMachine run', value)
    switch (this.currentState) {
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_0]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_1]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_2]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_3]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_4]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_5]):
        if (value === SPIKES_TYPE_ENUM.SPIKES_0) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_0])
          console.log('SpikesSubStateMachine run', value, this.currentState)
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_1) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_1])
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_2) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_2])
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_3) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_3])
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_4) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_4])
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_5) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_5])
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_0])
        break
    }
  }
}
