import { Scene, PerspectiveCamera, WebGLRenderer, Group, Raycaster, Vector2 } from 'three';
import { World, Material } from 'cannon';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Element } from './element';
import { Match } from '../match';
import {MatchService} from "../../service/match.service";

export class Visualization {
    ready:BehaviorSubject<boolean> = new BehaviorSubject(false);

    matchService:MatchService;

    cameraMousedownListener:EventListener;
    cameraMousemoveListener:EventListener;
    cameraMouseupListener:EventListener;
    cameraMousewheelListener:EventListener;
    cameraPointerlockchangeListener:EventListener;
    cameraButtonLocked:boolean = false;

    interactionMousemoveListener:EventListener;
    interactionMousedownListener:EventListener;
    currentSelectedObject:Group = null;
    currentSelectedElement:Element = null;

    resizeListener:EventListener;
    animationFrameId:number;

    sceneContainer:HTMLElement;
    scene:Scene;
    renderer:WebGLRenderer;
    camera:PerspectiveCamera;
    cameraRotationContainer:Group;
    cameraPositionContainer:Group;
    raycaster:Raycaster;
    mouse:Vector2;

    world:World;
    elementBodyMaterial:Material;
    environmentBodyMaterial:Material;

    elements:Element[] = [];
    match: Match;

    packageContainer: Group;
    centerContainer: Group;
}