import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, FSM_PARAM_TYPE_ENUM, SPIKES_TYPE_ENUM, TILE_TYPE_ENUM } from '../Enums'
import level1 from './level1'
import level2 from './level2'

export interface IEntity {
  x: number
  y: number
  direction: DIRECTION_ENUM
  state: FSM_PARAM_TYPE_ENUM
  type: ENTITY_TYPE_ENUM
}

export type SPIKES_NUMBER_TYPE = `${SPIKES_TYPE_ENUM}`

export interface ISpikes {
  x: number
  y: number
  type: SPIKES_TYPE_ENUM
  count: number
  total: SPIKES_NUMBER_TYPE
}

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export type MapInfo = Array<Array<ITile>>

export interface ILevel {
  mapInfo: MapInfo
  player: IEntity
  enemies: IEntity[]
  door: IEntity
  bursts: IEntity[]
  spikes: ISpikes[]
}

const Levels: Record<string, ILevel> = {
  level1,
  level2,
}

export default Levels
