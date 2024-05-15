import EnemyManager from '../Base/EnemyManager'
import EntityManager from '../Base/EntityManager'
import Singleton from '../Base/Singleton'
import DoorManager from '../Games/Door/DoorManager'
import PlayerManager from '../Games/Player/PlayerManager'
import { TileManager } from '../Games/Tile/TileManager'
import { MapInfo } from '../Levels'

export default class DataManager extends Singleton {
  static get instance() {
    return this.GetInstance<DataManager>()
  }

  levelIndex: number = 1

  mapInfo: MapInfo = []
  mapRowCount: number = 0
  mapColumnCount: number = 0

  tileInfo: TileManager[][] = []

  player: PlayerManager = null
  enemies: EnemyManager[] = []
  door: DoorManager = null
  bursts: EntityManager[] = []

  reset() {
    this.mapInfo = []
    this.tileInfo = []
  }

  next() {
    this.levelIndex++
  }
}
