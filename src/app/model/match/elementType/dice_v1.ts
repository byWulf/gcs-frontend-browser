import { ElementTypeInterface } from './elementTypeInterface';
import { Group, BoxGeometry, MeshPhongMaterial, Mesh } from 'three';

export class dice_v1 implements ElementTypeInterface {
    object: Group;

    constructor(private data: any) {
        this.object = new Group();
        this.object.name = 'dice_v1';

        let geometry = new BoxGeometry(1.5, 1.5, 1.5);
        let material = new MeshPhongMaterial({color: '#cccccc', shininess: 0});
        let mesh = new Mesh(geometry, material);
        mesh.position.y = 0.75;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.object.add(mesh);
    }

    /**
     * @inheritDoc
     */
    getTargetObject(data:any): Group {
        return null;
    }
}