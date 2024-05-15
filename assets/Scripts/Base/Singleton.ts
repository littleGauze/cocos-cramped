export default class Singleton {
 private static _instance: Singleton | null = null

  static GetInstance<T>(): T {
    if (!this._instance) {
      this._instance = new this()
    }
    return this._instance as T
  }
}
