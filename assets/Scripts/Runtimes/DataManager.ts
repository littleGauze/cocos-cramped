import EnemyManager from '../Base/EnemyManager'
import Singleton from '../Base/Singleton'
import BurstManager from '../Games/Burst/BurstManager'
import DoorManager from '../Games/Door/DoorManager'
import PlayerManager from '../Games/Player/PlayerManager'
import SmokeManager from '../Games/Smokes/SmokeManager'
import SpikesManager from '../Games/Spikes/SpikesManager'
import { TileManager } from '../Games/Tile/TileManager'
import { ILevel, MapInfo } from '../Levels'

export type IRecord = Omit<ILevel, 'mapInfo'>

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
  bursts: BurstManager[] = []
  spikes: SpikesManager[] = []
  smokes: SmokeManager[] = []
  records: IRecord[] = []

  reset() {
    this.mapInfo = []
    this.tileInfo = []
  }
}
