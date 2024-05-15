import { Layers, Node, SpriteFrame, UITransform, v2 } from 'cc'

export function randomByLength(n: number): string {
  return Array.from({ length: n }).reduce((total: string) => total + Math.random() * 10, '') as string
}

export function randomByRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function createUINode(name: string = '') {
  const node = new Node(name)
  node.layer = Layers.Enum.UI_2D
  const transform = node.addComponent(UITransform)
  transform.anchorPoint = v2(0, 1)
  return node
}

const getNumberWithinString = (str: string) => parseInt(str.match(/\((\d+)\)/)?.[1] || '0')
export function sortSpriteFrames(spriteFrames: SpriteFrame[]) {
  return spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
}
