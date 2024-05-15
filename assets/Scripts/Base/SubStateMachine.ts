import State from './State'
import StateMachine from './StateMachine'

export default abstract class SubStateMachine {
  private _currentState: State = null
  stateMachines: Map<string, State> = new Map()

  constructor(public fsm: StateMachine) {}

  get currentState() {
    return this._currentState
  }

  set currentState(state: State) {
    this._currentState = state
    this._currentState.run()
  }

  abstract run(): void
}
