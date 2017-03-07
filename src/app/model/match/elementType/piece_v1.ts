import { ElementTypeInterface } from './elementTypeInterface';

export class piece_v1 implements ElementTypeInterface {
    width: number;
    height: number;
    depth: number;
    model: string;

    constructor(private data: any) {
        this.width = data.width;
        this.height = data.height;
        this.depth = data.depth;
        this.model = data.model;
    }

    render(): string {
        return `<a-cone 
                    color="#cccc00" 
                    scale="${this.width} ${this.height} ${this.depth}" 
                    position="0 ${this.height / 2} 0" 
                    radius-bottom="1" 
                    radius-top="0.1"
                    shadow="cast: true; receive: false;"
                ></a-cone>`;
    }
}