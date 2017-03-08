import { Scene, PerspectiveCamera, WebGLRenderer, Group, } from 'three';

import { Element } from './element';

export class Visualization {
    resizeListener:Function;
    animationFrameId:number;

    sceneContainer:HTMLElement;
    scene:Scene;
    renderer:WebGLRenderer;
    camera:PerspectiveCamera;

    elements:Element[] = [];

    packageContainer: Group;
    centerContainer: Group;
}