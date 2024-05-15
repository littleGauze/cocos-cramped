import { _decorator, Component, Node } from 'cc'
import { createUINode } from '../../Utils'
import { TileMapManager } from '../Tile/TileMapManager'
import Levels, { ILevel } from '../../Levels'
import DataManager from '../../Runtimes/DataManager'
import { TILE_WIDTH } from '../Tile/TileManager'
import PlayerManager from '../Player/PlayerManager'
const { ccclass } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel = null
  stage: Node = null

  start() {
    this.generateState()
    this.initLevel()
  }

  generateState() {
    this.stage = createUINode('Stage')
    this.stage.setParent(this.node)
  }

  async initLevel() {
    const level = Levels[`level${DataManager.instance.levelIndex}`]
    if (level) {
      this.clearLevel()

      this.level = level

      DataManager.instance.mapInfo = level.mapInfo
      DataManager.instance.mapRowCount = level.mapInfo.length || 0
      DataManager.instance.mapColumnCount = level.mapInfo[0]?.length || 0

      await Promise.all([this.generateTileMap()])

      await this.generatePlayer()
    }
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.instance.reset()
  }

  async generateTileMap() {
    const node = createUINode('TileMap')
    node.setParent(this.stage)
    const tileMapManager = node.addComponent(TileMapManager)
    await tileMapManager.init()
    this.ajustMapPos()
  }

  ajustMapPos() {
    const { mapRowCount, mapColumnCount } = DataManager.instance
    const width = (mapRowCount * TILE_WIDTH) / 2
    const height = (mapColumnCount * TILE_WIDTH) / 2 + 80
    this.stage.setPosition(-width, height)
  }

  async generatePlayer() {
    const node = createUINode('Player')
    node.setParent(this.stage)
    const playerManager = node.addComponent(PlayerManager)
    await playerManager.init(this.level.player)
    DataManager.instance.player = playerManager
    return node
  }
}
