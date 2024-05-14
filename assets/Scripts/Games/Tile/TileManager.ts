import { _decorator, Component, Node, resources, SpriteFrame, Sprite, sp, UITransform, Size, Layers, Vec3, v3 } from 'cc';
import levels from '../../Levels';
const { ccclass, property } = _decorator;

const TILE_WIDTH = 55
const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
    start() {

    }

    async init() {
        const { mapInfo } = levels[`level${1}`]
        const sfs = await this.loadRes()
        for (let i = 0; i < mapInfo.length; i++) {
            const columns = mapInfo[i]
            for (let j = 0; j < columns.length; j++) {
                const item = columns[j]
                if (item.src === null && item.type === null) continue

                const node = new Node()
                node.setParent(this.node)
                node.layer = Layers.Enum.UI_2D
                node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)

                const sprite = node.addComponent(Sprite)
                sprite.spriteFrame = sfs.find(it => it.name === `tile (${item.src})`)
                const ut = sprite.getComponent(UITransform)
                ut.setContentSize(new Size(TILE_WIDTH, TILE_HEIGHT))
            }
        }
    }

    loadRes() {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir(`texture/tile/tile`, SpriteFrame, (err: Error, data: SpriteFrame[]) => {
                if (err) {
                    reject(err)
                    return []
                }
                resolve(data)
            })
        })
    }
}


