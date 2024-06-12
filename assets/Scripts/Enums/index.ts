export enum TILE_TYPE_ENUM {
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  WALL_ROW = 'WALL_ROW',
  WALL_COLUMN = 'WALL_COLUMN',
  CLIFF_LEFT = 'CLIFF_LEFT',
  CLIFF_RIGHT = 'CLIFF_RIGHT',
  CLIFF_CENTER = 'CLIFF_CENTER',
  FLOOR = 'FLOOR',
}

export enum PLAYER_ACTION_ENUM {
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
}

export enum EVENT_TYPE_ENUM {
  PLAYER_CTRL = 'PLAYER_CTRL',
  PLAYER_BORN = 'PLAYER_BORN',
  PLAYER_MOVE_END = 'PLAYER_MOVE_END',
  PLAYER_DEATH = 'PLAYER_DEATH',
  PLAYER_AIRDEATH = 'PLAYER_AIRDEATH',
  PLAYER_ATTACK = 'PLAYER_ATTACK',
  CHECK_DOOR_OPEN = 'CHECK_DOOR_OPEN',
  NEXT_LEVEL = 'NEXT_LEVEL',
  SHOW_SOMKE = 'SHOW_SOMKE',
  SHAKE = 'SHAKE',
}

export enum FSM_PARAM_TYPE_ENUM {
  TRIGGER = 'TRIGGER',
  NUMBER = 'NUMBER',
}

export enum FSM_PARAM_TYPE_ENUM {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  DIRECTION = 'DIRECTION',
  ATTACK = 'ATTACK',
  BLOCKFRONT = 'BLOCKFRONT',
  BLOCKBACK = 'BLOCKBACK',
  BLOCKLEFT = 'BLOCKLEFT',
  BLOCKRIGHT = 'BLOCKRIGHT',
  BLOCKTURNLEFT = 'BLOCKTURNLEFT',
  BLOCKTURNRIGHT = 'BLOCKTURNRIGHT',
  DEATH = 'DEATH',
  AIRDEATH = 'AIRDEATH',
  SPIKES_TOTAL_COUNT = 'SPIKES_TOTAL_COUNT',
  SPIKES_CUR_COUNT = 'SPIKES_CUR_COUNT',
}

export enum DIRECTION_ENUM {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export enum ENTITY_TYPE_ENUM {
  PLAYER = 'PLAYER',
  DOOR = 'DOOR',
  SKELETON_WOODEN = 'SKELETON_WOODEN',
  SKELETON_IRON = 'SKELETON_IRON',
  BURST = 'BURST',
  SMOKE = 'SMOKE',
}

export enum SPIKES_TYPE_ENUM {
  SPIKES_1 = 2,
  SPIKES_2,
  SPIKES_3,
  SPIKES_4,
  SPIKES_5,
}

export enum SPIKES_LOOP_NUMBER_ENUM {
  SPIKES_LOOP_0 = 0,
  SPIKES_LOOP_1 = 1,
  SPIKES_LOOP_2 = 2,
  SPIKES_LOOP_3 = 3,
  SPIKES_LOOP_4 = 4,
  SPIKES_LOOP_5 = 5,
}
