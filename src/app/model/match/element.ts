import { Parent } from './parent';
import { ElementTypeInterface } from './elementType/elementTypeInterface';

export class Element {
    id: string;
    type: string;
    parent: Parent;
    element: ElementTypeInterface;
}