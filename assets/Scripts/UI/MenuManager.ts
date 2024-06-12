import { Component, Event, _decorator } from 'cc'
import { EVENT_TYPE_ENUM, PLAYER_ACTION_ENUM } from '../Enums'
import EventManager from '../Runtimes/EventManger'

const { ccclass } = _decorator

@ccclass('MenuManager')
export default class MenuManager extends Component {
  handle(event: Event) {
    EventManager.instance.emit(EVENT_TYPE_ENUM.RECORD_REVOKE)
  }
}
