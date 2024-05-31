import { _decorator, Component, Node } from 'cc'
import { createUINode } from '../../Utils'
import { TileMapManager } from '../Tile/TileMapManager'
import Levels, { ILevel } from '../../Levels'
import DataManager from '../../Runtimes/DataManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager'
import PlayerManager from '../Player/PlayerManager'
import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM } from '../../Enums'
import WoodenSkeletonManager from '../WoodenSkeleton/WoodenSkeletonManager'
import EventManager from '../../Runtimes/EventManger'
import DoorManager from '../Door/DoorManager'
import IronSkeletonManager from '../IronSkeleton/IronSkeletonManager'
import BurstManager from '../Burst/BurstManager'
import SpikesManager from '../Spikes/SpikesManager'
import SmokeManager from '../Smokes/SmokeManager'
const { ccclass } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel = null
  stage: Node = null
  smokeLayer: Node = null

  start() {
    this.generateState()
    this.initLevel()

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.checkWin, this)
    EventManager.instance.on(EVENT_TYPE_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.instance.on(EVENT_TYPE_ENUM.SHOW_SOMKE, this.generateSmokes, this)
  }

  onDestroy(): void {
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_MOVE_END, this.checkWin)
    EventManager.instance.off(EVENT_TYPE_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.instance.off(EVENT_TYPE_ENUM.SHOW_SOMKE, this.generateSmokes)
  }

  generateState() {
    this.stage = createUINode('Stage')
    this.stage.setParent(this.node)
  }

  checkWin() {
    const player = DataManager.instance.player
    const door = DataManager.instance.door
    if (player.x === door.x && player.y === door.y && door.state === FSM_PARAM_TYPE_ENUM.DEATH) {
      EventManager.instance.emit(EVENT_TYPE_ENUM.NEXT_LEVEL)
    }
  }

  nextLevel() {
    const { levelIndex } = DataManager.instance
    DataManager.instance.levelIndex = (levelIndex % Object.keys(Levels).length) + 1
    this.initLevel()
  }

  async initLevel() {
    const level = Levels[`level${DataManager.instance.levelIndex}`]
    if (level) {
      this.clearLevel()

      this.level = level

      DataManager.instance.mapInfo = level.mapInfo
      DataManager.instance.mapRowCount = level.mapInfo.length || 0
      DataManager.instance.mapColumnCount = level.mapInfo[0]?.length || 0

      await Promise.all([
        this.generateTileMap(),
        this.generateBursts(),
        this.generateSpikes(),
        this.generateSmokeLayer(),
        this.generateEnimies(),
        this.generateDoor(),
      ])

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
    EventManager.instance.emit(EVENT_TYPE_ENUM.PLAYER_BORN, true)
    return node
  }

  async generateEnimies() {
    DataManager.instance.enemies = []
    const promises = []

    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const enemyManager = node.addComponent(Manager)
      promises.push(enemyManager.init(enemy))
      DataManager.instance.enemies.push(enemyManager)
    }

    await Promise.all(promises)
  }

  async generateBursts() {
    DataManager.instance.bursts = []
    const promises = []

    for (let i = 0; i < this.level.bursts.length; i++) {
      const burst = this.level.bursts[i]
      const node = createUINode()
      node.setParent(this.stage)
      const burstManager = node.addComponent(BurstManager)
      promises.push(burstManager.init(burst))
      DataManager.instance.bursts.push(burstManager)
    }

    await Promise.all(promises)
  }

  async generateSpikes() {
    DataManager.instance.spikes = []
    const promises = []

    for (let i = 0; i < this.level.spikes.length; i++) {
      const spike = this.level.spikes[i]
      const node = createUINode()
      node.setParent(this.stage)
      const spikeManager = node.addComponent(SpikesManager)
      promises.push(spikeManager.init(spike))
      DataManager.instance.spikes.push(spikeManager)
    }

    await Promise.all(promises)
  }

  async generateDoor() {
    const node = createUINode()
    node.setParent(this.stage)
    const doorManager = node.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DataManager.instance.door = doorManager
  }

  generateSmokeLayer() {
    const node = createUINode('SmokeLayer')
    node.setParent(this.stage)
    this.smokeLayer = node
  }

  async generateSmokes(x: number, y: number, direction: DIRECTION_ENUM) {
    const smoke = DataManager.instance.smokes.find(smoke => smoke.state === FSM_PARAM_TYPE_ENUM.DEATH)
    if (smoke) {
      smoke.x = x
      smoke.y = y
      smoke.direction = direction
      smoke.state = FSM_PARAM_TYPE_ENUM.IDLE
      smoke.node.setPosition(x * TILE_WIDTH - TILE_WIDTH * 1.5, -y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
    } else {
      const node = createUINode()
      node.setParent(this.smokeLayer)
      const smokeManager = node.addComponent(SmokeManager)
      await smokeManager.init({
        x,
        y,
        direction,
        type: ENTITY_TYPE_ENUM.SMOKE,
        state: FSM_PARAM_TYPE_ENUM.IDLE,
      })
      DataManager.instance.smokes.push(smokeManager)
      console.log(DataManager.instance.smokes)
    }
  }
}
