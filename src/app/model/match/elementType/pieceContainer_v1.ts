import { ElementTypeInterface } from './elementTypeInterface';
import { Group, Vector3 } from 'three';
import * as TWEEN from 'tween.js';
import { Visualization } from "../visualization";

class Position {
    index:number;
    x: number;
    y: number;
    next: number[];

    container: Group;
    places: Group[] = [];

    constructor(private data: any) {
        this.index = data.index;
        this.x = data.x;
        this.y = data.y;
        this.next = data.next;
    }
}

export class pieceContainer_v1 implements ElementTypeInterface {
    positions: Position[] = [];
    stackElementRadius: number = 1;

    object: Group;

    constructor(private data: any, private visualization:Visualization) {
        this.object = new Group();
        this.object.name = 'pieceContainer_v1';

        for (let i = 0; i < data.positions.length; i++) {
            let position:Position = new Position(data.positions[i]);

            position.container = new Group();
            position.container.name = 'pieceContainer_v1_target_' + position.index;
            position.container.position.x = position.x;
            position.container.position.z = position.y;
            this.object.add(position.container);

            this.positions.push(position);
        }

        this.stackElementRadius = data.stackElementRadius;
    }

    private rearrangePlaces(position:Position): void {
        if (position.places.length == 0) return;
        
        let elementsCount = position.places.length;

        //determine needed row count
        let rowCount = Math.ceil(Math.sqrt(elementsCount));
        let elementsPerRow:number[] = Array(rowCount).fill(0);

        //equally distribute places on each row
        let currentRow = 0;
        for (let i = 0; i < elementsCount; i++) {
            elementsPerRow[currentRow]++;
            currentRow = (currentRow + 1) % rowCount;
        }

        //sort "elements per row" count descending 
        elementsPerRow.sort((a,b):number => b-a );
        
        //iterate over the counts and alternate appending/prepending it to the final array, so 
        //the biggest values are in the middle and the lowest values get to the outer sides
        let finalColumnOrder:number[] = [];
        for (let i = 0; i < rowCount; i++) {
            if (i % 2 == 0) {
                finalColumnOrder.push(elementsPerRow[i]);
            } else {
                finalColumnOrder.unshift(elementsPerRow[i]);
            }
        }

        let index = 0;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < finalColumnOrder[i]; j++) {
                let place = position.places[index];
                if (place.userData.tween) place.userData.tween.stop();

                let targetPosition = {
                    x: -1 * ((finalColumnOrder[i] - 1) * this.stackElementRadius / 2) + j * this.stackElementRadius,
                    y: 0,
                    z: -1 * ((rowCount - 1) * this.stackElementRadius / 2) + i * this.stackElementRadius
                };

                let startVector: Vector3 = place.position.clone();

                place.userData.tween = new TWEEN.Tween(startVector)
                    .to(targetPosition, 250)
                    .onUpdate(() => {
                        place.position.x = startVector.x;
                        place.position.z = startVector.z;
                    }).easing(TWEEN.Easing.Quintic.Out);

                place.userData.tween.start();

                index++;
            }
        }
    }

    /**
     * @inheritDoc
     */
    getTargetObject(data:any): Group {
        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i].index == data.index) {
                let placeContainer = new Group();
                placeContainer.name = 'pieceContainer_v1_target_' + data.index;
                this.positions[i].container.add(placeContainer);
                this.positions[i].places.push(placeContainer);

                this.rearrangePlaces(this.positions[i]);

                return placeContainer;
            }
        }
        return null;
    }

    onChildRemoved(fromParent:Group): void {
        for (let i = 0; i < this.positions.length; i++) {
            for (let j = 0; j < this.positions[i].places.length; j++) {
                if (this.positions[i].places[j].children.length == 0) {
                    this.visualization.scene.remove(this.positions[i].places[j]);
                    this.positions[i].places.splice(j, 1);

                    this.rearrangePlaces(this.positions[i]);
                }
            }
        }
    }
}