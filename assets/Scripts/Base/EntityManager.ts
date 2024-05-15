import { Component, Sprite, UITransform, _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, FSM_PARAM_TYPE_ENUM } from '../Enums'
import { randomByLength } from '../Utils'
import StateMachine from './StateMachine'
import { TILE_HEIGHT, TILE_WIDTH } from '../Games/Tile/TileManager'
import { IEntity } from '../Levels'

const { ccclass } = _decorator

@ccclass('EntityManager')
export default class EntityManager extends Component {
  id: string = randomByLength(12)
  fsm: StateMachine = null

  protected transform: UITransform = null
  private _state: FSM_PARAM_TYPE_ENUM = FSM_PARAM_TYPE_ENUM.IDLE
  private _direction: DIRECTION_ENUM = DIRECTION_ENUM.UP
  type: ENTITY_TYPE_ENUM

  x: number = 0
  y: number = 0

  get state() {
    return this._state
  }

  set state(value: FSM_PARAM_TYPE_ENUM) {
    this._state = value
    this.fsm.setParams(value, true)
  }

  get direction() {
    return this._direction
  }

  set direction(value: DIRECTION_ENUM) {
    this._direction = value
    this.fsm.setParams(FSM_PARAM_TYPE_ENUM.DIRECTION, value as number)
  }

  init(params: IEntity) {
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    this.transform = this.node.getComponent(UITransform)
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
    this.x = params.x
    this.y = params.y
    this.state = params.state
    this.direction = params.direction
  }

  update(dt: number) {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}
