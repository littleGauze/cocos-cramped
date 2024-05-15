import { _decorator, Component, resources, SpriteFrame } from 'cc'
import ResourceManger from '../../Runtimes/ResourceManager'
import DataManager from '../../Runtimes/DataManager'
import { createUINode } from '../../Utils'
import { TileManager } from './TileManager'
const { ccclass } = _decorator

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  start() {}

  async init() {
    const { mapInfo } = DataManager.instance
    const spriteFrames = await ResourceManger.instance.loadDir('texture/tile/tile', SpriteFrame)
    for (let i = 0; i < mapInfo.length; i++) {
      const columns = mapInfo[i]
      DataManager.instance.tileInfo[i] = []
      for (let j = 0; j < columns.length; j++) {
        const item = columns[j]
        if (item.src === null && item.type === null) continue

        const tile = createUINode()
        tile.setParent(this.node)
        const tileManager = tile.addComponent(TileManager)
        const spriteFrame = spriteFrames.find(it => it.name === `tile (${item.src})`)
        tileManager.init(spriteFrame, i, j)

        DataManager.instance.tileInfo[i][j] = tileManager
      }
    }
  }
}
