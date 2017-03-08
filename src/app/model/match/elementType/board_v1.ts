import { ElementTypeInterface } from './elementTypeInterface';
import { BoxGeometry, MeshPhongMaterial, Mesh, Group } from 'three';

export class board_v1 implements ElementTypeInterface {
    width: number;
    height: number;
    image: string;

    object: Group;
    targetElement: Group;

    constructor(private data: any) {
        this.width = data.width;
        this.height = data.height;
        this.image = data.image;

        this.object = new Group();
        this.object.name = 'board_v1';

        let geometry = new BoxGeometry(this.width, 0.002, this.height);
        let material = new MeshPhongMaterial({color: '#00aa00', shininess: 0});
        let mesh = new Mesh(geometry, material);
        mesh.position.y = 0.001;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.object.add(mesh);

        this.targetElement = new Group();
        this.targetElement.name = 'board_v1_target';
        this.targetElement.position.y = 0.002;
        this.object.add(this.targetElement);
    }

    /**
     * @inheritDoc
     */
    getTargetObject(data:any): Group {
        return this.targetElement;
    }
}