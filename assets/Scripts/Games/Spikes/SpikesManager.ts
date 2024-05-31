import { Component, Sprite, UITransform, _decorator } from 'cc'
import { randomByLength } from '../../Utils'
import StateMachine from '../../Base/StateMachine'
import { EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM, SPIKES_TYPE_ENUM } from '../../Enums'
import { ISpikes } from '../../Levels'
import { TILE_WIDTH, TILE_HEIGHT } from '../Tile/TileManager'
import SpikesStateMachine from './SpikesStateMachine'
import EventManager from '../../Runtimes/EventManger'
import DataManager from '../../Runtimes/DataManager'

const { ccclass } = _decorator

@ccclass('SpikesManager')
export default class SpikesManager extends Component {
  id: string = randomByLength(12)
  fsm: StateMachine = null

  protected transform: UITransform = null
  private _state: FSM_PARAM_TYPE_ENUM = FSM_PARAM_TYPE_ENUM.IDLE
  private _count: number = 0
  private _totalCount: number = 0
  type: SPIKES_TYPE_ENUM

  x: number = 0
  y: number = 0

  get state() {
    return this._state
  }

  set state(value: FSM_PARAM_TYPE_ENUM) {
    this._state = value
    this.fsm.setParams(value, true)
  }

  get count() {
    return this._count
  }

  set count(value: number) {
    this._count = value
    this.fsm.setParams(FSM_PARAM_TYPE_ENUM.SPIKES_CUR_COUNT, value)
  }

  get totalCount() {
    return this._totalCount
  }

  set totalCount(value: number) {
    this._totalCount = value
    this.fsm.setParams(FSM_PARAM_TYPE_ENUM.SPIKES_TOTAL_COUNT, value)
  }

  async init(params: ISpikes) {
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    this.transform = this.node.getComponent(UITransform)
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(SpikesStateMachine)
    await this.fsm.init()

    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.count = params.count
    this.totalCount = SPIKES_TYPE_ENUM[SPIKES_TYPE_ENUM[this.type]]

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.loop, this)
  }

  onDestroy(): void {
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.loop)
  }

  loop() {
    const { x, y } = DataManager.instance.player
    if (this.count < this.totalCount) {
      this.count++
    }

    if (this.count === this.totalCount && this.x === x && this.y === y) {
      EventManager.instance.emit(EVENT_TYPE_ENUM.PLAYER_DEATH)
    }
  }

  onAttack() {}

  reset() {
    this.count = 0
  }

  update(dt: number) {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}
