import { ElementTypeInterface } from './elementTypeInterface';
import { BoxGeometry, MeshPhongMaterial, Mesh, Group, ImageUtils } from 'three';
import { PathService } from '../../../service/path.service';
import { Visualization } from "../visualization";

export class board_v1 implements ElementTypeInterface {
    width: number;
    height: number;
    image: string;

    object: Group;
    targetElement: Group;

    constructor(private data: any, private visualization:Visualization) {
        this.width = data.width;
        this.height = data.height;
        this.image = data.image;

        this.object = new Group();
        this.object.name = 'board_v1';

        let geometry = new BoxGeometry(this.width, 0.2, this.height);
        ImageUtils.crossOrigin = 'anonymous';
        let material = new MeshPhongMaterial({shininess: 0, map: ImageUtils.loadTexture(PathService.getAbsoluteGameElementPath(visualization.match.game.key, this.image))});
        let mesh = new Mesh(geometry, material);
        mesh.position.y = 0.1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.object.add(mesh);

        this.targetElement = new Group();
        this.targetElement.name = 'board_v1_target';
        this.targetElement.position.y = 0.2;
        this.object.add(this.targetElement);
    }

    /**
     * @inheritDoc
     */
    getTargetObject(data:any): Group {
        return this.targetElement;
    }
}