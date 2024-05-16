import { Vec2, _decorator } from 'cc'
import { DIRECTION_ENUM, EVENT_TYPE_ENUM, FSM_PARAM_TYPE_ENUM, PLAYER_ACTION_ENUM } from '../../Enums'
import EventManager from '../../Runtimes/EventManger'
import EntityManager from '../../Base/EntityManager'
import { IEntity } from '../../Levels'
import PlayerStateMachine from './PlayerStateMachine'
import DataManager from '../../Runtimes/DataManager'
import EnemyManager from '../../Base/EnemyManager'
import BurstManager from '../Burst/BurstManager'

const { ccclass } = _decorator

@ccclass('PlayerManager')
export default class PlayerManager extends EntityManager {
  private readonly speed: number = 1 / 10

  targetX: number = 0
  targetY: number = 0

  isMoving: boolean = false

  start() {}

  async init(params: IEntity) {
    this.fsm = this.node.addComponent(PlayerStateMachine)
    await this.fsm.init()

    super.init(params)
    this.targetX = params.x
    this.targetY = params.y

    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_CTRL, this.inputProcess, this)
    EventManager.instance.on(EVENT_TYPE_ENUM.PLAYER_DEATH, this.onPlayerDeath, this)
  }

  onDestroy() {
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_CTRL, this.inputProcess)
    EventManager.instance.off(EVENT_TYPE_ENUM.PLAYER_DEATH, this.onPlayerDeath)
  }

  onPlayerDeath() {
    this.state = FSM_PARAM_TYPE_ENUM.DEATH
  }

  update(dt: number) {
    super.update(dt)
    this.updatePos(dt)
  }

  updatePos(dt: number) {
    if (this.x < this.targetX) {
      this.x += this.speed
    } else if (this.x > this.targetX) {
      this.x -= this.speed
    }

    if (this.y < this.targetY) {
      this.y += this.speed
    } else if (this.y > this.targetY) {
      this.y -= this.speed
    }

    if (Math.abs(this.targetX - this.x) < 0.1 && Math.abs(this.targetY - this.y) < 0.1 && this.isMoving) {
      this.x = this.targetX
      this.y = this.targetY
      this.isMoving = false
      EventManager.instance.emit(EVENT_TYPE_ENUM.PLAYER_MOVE_END)
    }
  }

  inputProcess(type: PLAYER_ACTION_ENUM) {
    if (this.isMoving) return

    if (
      this.state === FSM_PARAM_TYPE_ENUM.DEATH ||
      this.state === FSM_PARAM_TYPE_ENUM.AIRDEATH ||
      this.state === FSM_PARAM_TYPE_ENUM.ATTACK
    ) {
      return
    }
    if (this.willBlock(type)) {
      return
    }
    this.move(type)
  }

  move(type: PLAYER_ACTION_ENUM) {
    switch (type) {
      case PLAYER_ACTION_ENUM.MOVE_LEFT:
        this.targetX -= 1
        this.isMoving = true
        break
      case PLAYER_ACTION_ENUM.MOVE_RIGHT:
        this.targetX += 1
        this.isMoving = true
        break
      case PLAYER_ACTION_ENUM.MOVE_UP:
        this.targetY -= 1
        this.isMoving = true
        break
      case PLAYER_ACTION_ENUM.MOVE_DOWN:
        this.targetY += 1
        this.isMoving = true
        break
      case PLAYER_ACTION_ENUM.TURN_LEFT:
        if (this.direction === DIRECTION_ENUM.UP) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.DOWN
        } else if (this.direction === DIRECTION_ENUM.DOWN) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.UP
        }
        this.state = FSM_PARAM_TYPE_ENUM.TURN_LEFT
        break
      case PLAYER_ACTION_ENUM.TURN_RIGHT:
        if (this.direction === DIRECTION_ENUM.UP) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.UP
        } else if (this.direction === DIRECTION_ENUM.DOWN) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.DOWN
        }
        this.state = FSM_PARAM_TYPE_ENUM.TURN_RIGHT
        break
      default:
        break
    }
  }

  willBlock(type: PLAYER_ACTION_ENUM) {
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo: tileInfo } = DataManager.instance
    const enemies: EnemyManager[] = DataManager.instance.enemies.filter(
      (enemy: EnemyManager) => enemy.state !== FSM_PARAM_TYPE_ENUM.DEATH,
    )
    const { x: doorX, y: doorY, state: doorState } = DataManager.instance.door || {}
    const bursts: BurstManager[] = DataManager.instance.bursts.filter(
      (burst: BurstManager) => burst.state !== FSM_PARAM_TYPE_ENUM.DEATH,
    )

    const { mapRowCount: row, mapColumnCount: column } = DataManager.instance

    //按钮方向——向上
    if (type === PLAYER_ACTION_ENUM.MOVE_UP) {
      const playerNextY = y - 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.UP) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        const weaponNextY = y - 2
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        // 判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === x && enemyY === weaponNextY) || (enemyX === x && enemyY === playerNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.DOWN) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        const weaponNextY = y
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if (enemyX === x && enemyY === playerNextY) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
            return true
          }
        }

        // 判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }
      }

      //按钮方向——向下
    } else if (type === PLAYER_ACTION_ENUM.MOVE_DOWN) {
      const playerNextY = y + 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.UP) {
        if (playerNextY > column - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK

          return true
        }

        const weaponNextY = y
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if (enemyX === x && enemyY === playerNextY) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
            return true
          }
        }

        // 判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.DOWN) {
        if (playerNextY > column - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT

          return true
        }

        const weaponNextY = y + 2
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === x && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        // 判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === x && enemyY === weaponNextY) || (enemyX === x && enemyY === playerNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        if (playerNextY > column - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT

          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        if (playerNextY > column - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT

          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === x && doorY === playerNextY) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === x && enemyY === playerNextY) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === x && burst.y === playerNextY) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }
      }

      //按钮方向——向左
    } else if (type === PLAYER_ACTION_ENUM.MOVE_LEFT) {
      const playerNextX = x - 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.UP) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT

          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.DOWN) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT

          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT

          return true
        }

        const weaponNextX = x - 2
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === y)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK

          return true
        }

        const weaponNextX = x
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if (enemyX === playerNextX && enemyY === y) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }
      }

      //按钮方向——向右
    } else if (type === PLAYER_ACTION_ENUM.MOVE_RIGHT) {
      const playerNextX = x + 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.UP) {
        if (playerNextX > row - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT

          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKRIGHT
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.DOWN) {
        if (playerNextX > row - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT

          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === weaponNextY)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === weaponNextY)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKLEFT
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        if (playerNextX > row - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK

          return true
        }

        const weaponNextX = x
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if (enemyX === playerNextX && enemyY === y) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKBACK
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        if (playerNextX > row - 1) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT

          return true
        }

        const weaponNextX = x + 2
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]

        //判断门
        if (
          ((doorX === playerNextX && doorY === y) || (doorX === weaponNextX && doorY === y)) &&
          doorState !== FSM_PARAM_TYPE_ENUM.DEATH
        ) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }

        //判断敌人
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i]
          const { x: enemyX, y: enemyY } = enemy

          if ((enemyX === playerNextX && enemyY === y) || (enemyX === weaponNextX && enemyY === y)) {
            this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
            return true
          }
        }

        //判断地裂陷阱
        if (
          bursts.some(burst => burst.x === playerNextX && burst.y === y) &&
          (!nextWeaponTile || nextWeaponTile.turnable)
        ) {
          return false
        }

        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKFRONT
          return true
        }
      }

      //按钮方向——左转
    } else if (type === PLAYER_ACTION_ENUM.TURN_LEFT) {
      let nextY, nextX
      if (direction === DIRECTION_ENUM.UP) {
        //朝上左转的话，左上角三个tile都必须turnable为true，并且没有敌人
        nextY = y - 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.DOWN) {
        nextY = y + 1
        nextX = x + 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextY = y + 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextY = y - 1
        nextX = x + 1
      }

      //判断门
      if (
        ((doorX === x && doorY === nextY) ||
          (doorX === nextX && doorY === y) ||
          (doorX === nextX && doorY === nextY)) &&
        doorState !== FSM_PARAM_TYPE_ENUM.DEATH
      ) {
        this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT
        return true
      }

      //判断敌人
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i]
        const { x: enemyX, y: enemyY } = enemy

        if (enemyX === nextX && enemyY === y) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT

          return true
        } else if (enemyX === nextX && enemyY === nextY) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT

          return true
        } else if (enemyX === x && enemyY === nextY) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT

          return true
        }
      }

      //最后判断地图元素
      if (
        (!tileInfo[x]?.[nextY] || tileInfo[x]?.[nextY].turnable) &&
        (!tileInfo[nextX]?.[y] || tileInfo[nextX]?.[y].turnable) &&
        (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)
      ) {
        // empty
      } else {
        this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNLEFT
        return true
      }

      //按钮方向——右转
    } else if (type === PLAYER_ACTION_ENUM.TURN_RIGHT) {
      let nextX, nextY
      if (direction === DIRECTION_ENUM.UP) {
        //朝上右转的话，右上角三个tile都必须turnable为true
        nextY = y - 1
        nextX = x + 1
      } else if (direction === DIRECTION_ENUM.DOWN) {
        nextY = y + 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextY = y - 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextY = y + 1
        nextX = x + 1
      }

      //判断门
      if (
        ((doorX === x && doorY === nextY) ||
          (doorX === nextX && doorY === y) ||
          (doorX === nextX && doorY === nextY)) &&
        doorState !== FSM_PARAM_TYPE_ENUM.DEATH
      ) {
        this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT
        return true
      }

      //判断敌人
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i]
        const { x: enemyX, y: enemyY } = enemy

        if (enemyX === nextX && enemyY === y) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT

          return true
        } else if (enemyX === nextX && enemyY === nextY) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT

          return true
        } else if (enemyX === x && enemyY === nextY) {
          this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT

          return true
        }
      }

      //最后判断地图元素
      if (
        (!tileInfo[x]?.[nextY] || tileInfo[x]?.[nextY].turnable) &&
        (!tileInfo[nextX]?.[y] || tileInfo[nextX]?.[y].turnable) &&
        (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)
      ) {
        // empty
      } else {
        this.state = FSM_PARAM_TYPE_ENUM.BLOCKTURNRIGHT
        return true
      }
    }

    return false
  }
}
