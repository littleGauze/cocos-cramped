import Singleton from '../Base/Singleton'

export interface IEvent {
  callback: Function
  ctx: unknown
}

export default class EventManager extends Singleton {
  private _events: Map<string, IEvent[]> = new Map()

  static get instance() {
    return this.GetInstance<EventManager>()
  }

  on(event: string, callback: Function, ctx: unknown) {
    const handle = { callback, ctx }
    if (!this._events.has(event)) {
      this._events.set(event, [handle])
    } else {
      this._events.get(event).push(handle)
    }
  }

  off(event: string, callback: Function) {
    if (!this._events.has(event)) {
      return
    }
    const handles = this._events.get(event)
    const index = handles.findIndex(handle => handle.callback === callback)
    if (index >= 0) {
      handles.splice(index, 1)
    }
  }

  emit(event: string, ...data: unknown[]) {
    if (!this._events.has(event)) {
      return
    }
    const handles = this._events.get(event)
    for (const handle of handles) {
      handle.callback.apply(handle.ctx, data)
    }
  }
}
