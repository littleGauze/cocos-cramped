import { _decorator, Animation, AnimationClip } from 'cc'
import StateMachine, { getInitNumberParams } from '../../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM, SPIKES_TYPE_ENUM } from '../../Enums'
import SpikesSubStateMachine from './SpikesSubStateMachine'
import SpikesManager from './SpikesManager'

const { ccclass } = _decorator

@ccclass('SpikesStateMachine')
export default class SpikesStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(FSM_PARAM_TYPE_ENUM.SPIKES_CUR_COUNT, getInitNumberParams())
    this.params.set(FSM_PARAM_TYPE_ENUM.SPIKES_TOTAL_COUNT, getInitNumberParams())
  }

  initStateMachines() {
    this.stateMachines.set(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_1], new SpikesSubStateMachine(this, 'spikesone'))
    this.stateMachines.set(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_2], new SpikesSubStateMachine(this, 'spikestwo'))
    this.stateMachines.set(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_3], new SpikesSubStateMachine(this, 'spikesthree'))
    this.stateMachines.set(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_4], new SpikesSubStateMachine(this, 'spikesfour'))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip?.name
      const value = this.params.get(FSM_PARAM_TYPE_ENUM.SPIKES_TOTAL_COUNT).value
      const spikesManager = this.getComponent(SpikesManager)
      if (
        (value === SPIKES_TYPE_ENUM.SPIKES_1 && name.includes('spikesone/two')) ||
        (value === SPIKES_TYPE_ENUM.SPIKES_2 && name.includes('spikestwo/three')) ||
        (value === SPIKES_TYPE_ENUM.SPIKES_3 && name.includes('spikesthree/four')) ||
        (value === SPIKES_TYPE_ENUM.SPIKES_4 && name.includes('spikesfour/five'))
      ) {
        spikesManager.reset()
      }
    })
  }

  run(): void {
    const value = this.params.get(FSM_PARAM_TYPE_ENUM.SPIKES_TOTAL_COUNT).value
    switch (this.currentState) {
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_1]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_2]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_3]):
      case this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_4]):
        if (value === SPIKES_TYPE_ENUM.SPIKES_1) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_1])
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_2) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_2])
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_3) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_3])
        } else if (value === SPIKES_TYPE_ENUM.SPIKES_4) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_4])
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM.SPIKES_1])
        break
    }
  }
}
