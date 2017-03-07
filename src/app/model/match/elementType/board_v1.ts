import { ElementTypeInterface } from './elementTypeInterface';

export class board_v1 implements ElementTypeInterface {
    width: number;
    height: number;
    image: string;

    constructor(private data: any) {
        this.width = data.width;
        this.height = data.height;
        this.image = data.image;
    }

    render(): string {
        return '<a-entity position="0 0 0.001"><a-box color="#00aa00" scale="' + this.width + ' 0.002 ' + this.height + '" shadow="cast: false; receive: true;"></a-box></a-entity>';
    }
}