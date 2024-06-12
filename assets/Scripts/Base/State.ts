import { AnimationClip, Sprite, SpriteFrame, animation } from 'cc'
import StateMachine from './StateMachine'
import { sortSpriteFrames } from '../Utils'
import ResourceManger from '../Runtimes/ResourceManager'

export const ANIMATION_SPEED = 1 / 10

export default class State {
  animationClip: AnimationClip = null

  constructor(
    private fsm: StateMachine,
    private path: string,
    private mode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed: number = ANIMATION_SPEED,
    private events: AnimationClip.IEvent[] = [],
  ) {
    this.init()
  }

  async init() {
    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const waiting = ResourceManger.instance.loadDir(this.path, SpriteFrame)
    this.fsm.waitingList.push(waiting)
    const spriteFrames = await waiting
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrames(spriteFrames).map((frame: SpriteFrame, i: number) => [
      i * this.speed,
      frame,
    ])
    track.channel.curve.assignSorted(frames)

    this.animationClip = new AnimationClip()
    this.animationClip.wrapMode = this.mode
    this.animationClip.addTrack(track)
    this.animationClip.name = this.path
    this.animationClip.duration = this.speed * frames.length

    if (this.events.length > 0) {
      this.animationClip.events = this.events
    }
  }

  run() {
    if (this.fsm.animationComponent.defaultClip?.name === this.animationClip.name) return
    if (this.fsm.animationComponent) {
      this.fsm.animationComponent.defaultClip = this.animationClip
      this.fsm.animationComponent.play()
    }
  }
}
