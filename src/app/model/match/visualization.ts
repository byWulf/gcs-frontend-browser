import { Scene, PerspectiveCamera, WebGLRenderer, Group, } from 'three';
import { World, Material } from 'cannon';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Element } from './element';
import { Match } from '../match';

export class Visualization {
    ready:BehaviorSubject<boolean> = new BehaviorSubject(false);

    mousedownListener:EventListener;
    mousemoveListener:EventListener;
    mouseupListener:EventListener;
    mousewheelListener:EventListener;
    pointerlockchangeListener:EventListener;
    buttonLocked:boolean = false;

    resizeListener:EventListener;
    animationFrameId:number;

    sceneContainer:HTMLElement;
    scene:Scene;
    renderer:WebGLRenderer;
    camera:PerspectiveCamera;
    cameraRotationContainer:Group;
    cameraPositionContainer:Group;

    world:World;
    elementBodyMaterial:Material;
    environmentBodyMaterial:Material;

    elements:Element[] = [];
    match: Match;

    packageContainer: Group;
    centerContainer: Group;
}