import { Component, Event, _decorator } from 'cc'
import { EVENT_TYPE_ENUM, PLAYER_ACTION_ENUM } from '../Enums'
import EventManager from '../Runtimes/EventManger'

const { ccclass } = _decorator

@ccclass('ControllerManager')
export default class ControllerManager extends Component {
  handle(event: Event, type: PLAYER_ACTION_ENUM) {
    EventManager.instance.emit(EVENT_TYPE_ENUM.PLAYER_CTRL, type)
  }
}
