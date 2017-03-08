import { ElementTypeInterface } from './elementTypeInterface';
import { Group, ConeGeometry, MeshPhongMaterial, Mesh } from 'three';

export class piece_v1 implements ElementTypeInterface {
    width: number;
    height: number;
    depth: number;
    model: string;
    color: string;

    object: Group;

    constructor(private data: any) {
        this.width = data.width;
        this.height = data.height;
        this.depth = data.depth;
        this.model = data.model;
        this.color = data.color;

        this.object = new Group();
        this.object.name = 'piece_v1';

        let geometry = new ConeGeometry(this.width, this.height, 16);
        let material = new MeshPhongMaterial({color: this.color, shininess: 0});
        let mesh = new Mesh(geometry, material);
        mesh.position.y = this.height / 2;
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