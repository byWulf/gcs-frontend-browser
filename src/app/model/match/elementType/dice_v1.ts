import { ElementTypeInterface } from './elementTypeInterface';
import { Group, BoxGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three';
import { DiceObject, DiceD6, DiceManager } from 'threejs-dice';
import { Visualization } from "../visualization";

export class dice_v1 implements ElementTypeInterface {
    object: Group;
    dice: DiceObject;

    constructor(private data: any, private visualization:Visualization) {
        this.object = new Group();
        this.object.name = 'dice_v1';

        if (!DiceManager.world) {
            DiceManager.setWorld(visualization.world);
        }

        this.dice = new DiceD6({size: 1.5});
        this.dice.getObject().body.material = visualization.elementBodyMaterial;
        this.dice.getObject().position.y = 0.75;
        this.dice.updateBodyFromMesh();

        this.object.add(this.dice.getObject());
    }

    /**
     * @inheritDoc
     */
    getTargetObject(data:any): Group {
        return null;
    }

    /**
     * @inheritDoc
     */
    onRendered(): void {
        this.dice.updateMeshFromBody();
    }

    onEvent(event:string, data:any): void {
        if (event == 'dice.rolled') {
            this.dice.getObject().body.position.x = 0;
            this.dice.getObject().body.position.z = 0;
            this.dice.getObject().body.velocity.y = 70;
            let factor = 100;
            this.dice.getObject().body.angularVelocity.set(factor * Math.random() - factor/2, factor * Math.random() - factor / 2, factor * Math.random() - factor/2);

            DiceManager.prepareValues([{
                dice: this.dice,
                value: data.value
            }]);
            console.log("dice throwed: ", data.value);
        }
    }
}