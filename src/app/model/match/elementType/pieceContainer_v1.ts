import { ElementTypeInterface } from './elementTypeInterface';

class Position {
    index:number;
    x: number;
    y: number;
    next: number[];

    constructor(private data: any) {
        this.index = data.index;
        this.x = data.x;
        this.y = data.y;
        this.next = data.next;
    }
}

export class pieceContainer_v1 implements ElementTypeInterface {
    positions: Position[] = [];

    constructor(private data: any) {
        for (let i = 0; i < data.positions.length; i++) {
            this.positions.push(new Position(data.positions[i]));
        }
    }

    render(): string {
        let element:string = `<a-entity>`;

        for (let position of this.positions) {
            element += `<a-entity class="position" 
data-index="${position.index}" position="${position.x} 0 ${position.y}"></a-entity>`;
        }

        element += `</a-entity>`;

        return element;
    }

    getTarget(data:any): string {
        return 'a-entity.position[data-index="' + data.index + '"]:first';
    }
}