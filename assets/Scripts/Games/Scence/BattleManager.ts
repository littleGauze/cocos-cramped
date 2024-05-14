import { _decorator, Component, Node } from 'cc';
import { TileManager } from '../Tile/TileManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    start() {
        this.generateTileMap()
    }

    generateTileMap() {
        const stage = new Node()
        stage.setParent(this.node)
        const tileMap = new Node()
        tileMap.setParent(stage)
        const tileManger = tileMap.addComponent(TileManager)
        tileManger.init()
    }
}


