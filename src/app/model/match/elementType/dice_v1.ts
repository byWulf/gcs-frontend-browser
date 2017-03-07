import { ElementTypeInterface } from './elementTypeInterface';

export class dice_v1 implements ElementTypeInterface {
    render(): string {
        return '<a-box scale="0.015 0.015 0.015" position="0 0.0075 0" shadow="cast: true; receive: false;"></a-box>';
    }
}