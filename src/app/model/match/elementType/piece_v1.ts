import { ElementTypeInterface } from './elementTypeInterface';
import { Group, MeshPhongMaterial, Object3D } from 'three';
import {OBJLoader} from "../../../service/three/objLoader.service";
import { PathService } from '../../../service/path.service';
import { Visualization } from "../visualization";

export class piece_v1 implements ElementTypeInterface {
    model: string;
    color: string;

    object: Group;

    constructor(private data: any, private visualization:Visualization) {
        this.model = data.model;
        this.color = data.color;

        this.object = new Group();
        this.object.name = 'piece_v1';

        let material = new MeshPhongMaterial({color: this.color, shininess: 0});
        let loader = new OBJLoader();
        loader.load(PathService.getAbsoluteGameElementPath(visualization.match.game.key, this.model), material, (object:Object3D) => {
            object.castShadow = true;
            object.receiveShadow = true;
            this.object.add(object);
        });
    }

    /**
     * @inheritDoc
     */
    getTargetObject(data:any): Group {
        return null;
    }
}