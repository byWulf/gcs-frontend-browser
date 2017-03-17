import { Group } from 'three';

export interface ElementTypeInterface {
    object: Group;

    /**
     * Returns the Object3D element, where another element should be placed in, when this element is its parent.
     *
     * @param data provided data to determine, into which element of this element another element should be placed
     */
    getTargetObject?(data:any): Group;

    /**
     * Gets called when a child is removed from this element.
     *
     * @param fromParent
     */
    onChildRemoved?(fromParent:Group): void;

    /**
     * Gets called when the world is rendered. Gets called each frame.
     */
    onRendered?(): void;

    onEvent?(event: string, data: any): void;
}