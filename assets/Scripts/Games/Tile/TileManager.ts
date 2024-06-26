import { _decorator, Component, SpriteFrame, Sprite, UITransform, Size } from 'cc'
import { TILE_TYPE_ENUM } from '../../Enums'
const { ccclass } = _decorator

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM

  turnable: boolean = false
  moveable: boolean = false

  async init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
    this.type = type

    if (
      this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
      this.type === TILE_TYPE_ENUM.WALL_ROW ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
    ) {
      this.turnable = false
      this.moveable = false
    } else if (
      this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
      this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
      this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
    ) {
      this.turnable = true
      this.moveable = false
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.turnable = true
      this.moveable = true
    }

    const sprite = this.node.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    const ut = this.getComponent(UITransform)
    ut.setContentSize(new Size(TILE_WIDTH, TILE_HEIGHT))
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}
