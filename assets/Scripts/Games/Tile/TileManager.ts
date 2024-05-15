import { _decorator, Component, SpriteFrame, Sprite, UITransform, Size } from 'cc'
const { ccclass } = _decorator

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
  start() {}

  async init(spriteFrame: SpriteFrame, i: number, j: number) {
    const sprite = this.node.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    const ut = this.getComponent(UITransform)
    ut.setContentSize(new Size(TILE_WIDTH, TILE_HEIGHT))
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}
