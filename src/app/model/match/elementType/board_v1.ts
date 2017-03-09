import { ElementTypeInterface } from './elementTypeInterface';
import { BoxGeometry, MeshPhongMaterial, Mesh, Group, ImageUtils } from 'three';
import { PathService } from '../../../service/path.service';
import {Match} from "../../match";

export class board_v1 implements ElementTypeInterface {
    width: number;
    height: number;
    image: string;

    object: Group;
    targetElement: Group;

    constructor(private data: any, private match:Match) {
        this.width = data.width;
        this.height = data.height;
        this.image = data.image;

        this.object = new Group();
        this.object.name = 'board_v1';

        let geometry = new BoxGeometry(this.width, 0.002, this.height);
        ImageUtils.crossOrigin = 'anonymous';
        let material = new MeshPhongMaterial({shininess: 0, map: ImageUtils.loadTexture(PathService.getAbsoluteGameElementPath(match.game.key, this.image))});
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