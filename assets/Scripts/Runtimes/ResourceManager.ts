import { SpriteFrame, _decorator, resources } from 'cc'
import Singleton from '../Base/Singleton'

const { ccclass } = _decorator

@ccclass('ResourceManger')
export default class ResourceManger extends Singleton {
  static get instance() {
    return this.GetInstance<ResourceManger>()
  }

  private _cache: Map<string, SpriteFrame | SpriteFrame[]> = new Map()

  loadRes(path: string, type: typeof SpriteFrame = SpriteFrame): Promise<SpriteFrame> {
    return new Promise<SpriteFrame>((resolve, reject) => {
      if (this._cache.has(path)) return resolve(this._cache.get(path) as SpriteFrame)
      resources.load<SpriteFrame>(path, type, (err: Error, data: SpriteFrame) => {
        if (err) {
          reject(err)
          return null
        }
        resolve(data)
        this._cache.set(path, data)
      })
    })
  }

  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame): Promise<SpriteFrame[]> {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      if (this._cache.has(path)) return resolve(this._cache.get(path) as SpriteFrame[])
      resources.loadDir<SpriteFrame>(path, type, (err: Error, data: SpriteFrame[]) => {
        if (err) {
          reject(err)
          return []
        }
        resolve(data)
      })
    })
  }
}
