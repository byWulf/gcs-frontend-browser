import { ElementTypeInterface } from './elementTypeInterface';
import { Group } from 'three';

class Position {
    index:number;
    x: number;
    y: number;
    next: number[];

    object: Group;

    constructor(private data: any) {
        this.index = data.index;
        this.x = data.x;
        this.y = data.y;
        this.next = data.next;
    }
}

export class pieceContainer_v1 implements ElementTypeInterface {
    positions: Position[] = [];

    object: Group;

    constructor(private data: any) {
        this.object = new Group();
        this.object.name = 'pieceContainer_v1';

        for (let i = 0; i < data.positions.length; i++) {
            let position:Position = new Position(data.positions[i]);

            position.object = new Group();
            position.object.name = 'pieceContainer_v1_target_' + position.index;
            position.object.position.x = position.x;
            position.object.position.z = position.y;
            this.object.add(position.object);

            this.positions.push(position);
        }
    }

    /**
     * @inheritDoc
     */
    getTargetObject(data:any): Group {
        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i].index == data.index) {
                return this.positions[i].object;
            }
        }
        return null;
    }
}