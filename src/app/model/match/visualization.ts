import { Scene, PerspectiveCamera, WebGLRenderer, Group, } from 'three';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Element } from './element';
import { Match } from '../match';

export class Visualization {
    ready:BehaviorSubject<boolean> = new BehaviorSubject(false);

    resizeListener:Function;
    animationFrameId:number;

    sceneContainer:HTMLElement;
    scene:Scene;
    renderer:WebGLRenderer;
    camera:PerspectiveCamera;

    elements:Element[] = [];
    match: Match;

    packageContainer: Group;
    centerContainer: Group;
}