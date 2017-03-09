import {Injectable} from "@angular/core";
import {
    AmbientLight,
    DirectionalLight,
    Group,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import {WindowRefService} from "./windowRef.service";

import {Visualization} from "../model/match/visualization";
import {Element} from "../model/match/element";
import {Parent} from "../model/match/parent";
import * as ElementTypes from "../model/match/elementTypes";

@Injectable()
export class MatchVisualizationService {
    constructor(
        private windowRef: WindowRefService
    ) {}

    private addScene(visualization:Visualization): void {
        visualization.scene = new Scene();
        visualization.scene.name = 'scene';
        this.windowRef.nativeWindow.scene = visualization.scene;
        this.windowRef.nativeWindow.THREE = THREE;
    }

    private addCamera(visualization:Visualization): void {
        visualization.camera = new PerspectiveCamera(75, visualization.sceneContainer.offsetWidth / visualization.sceneContainer.offsetHeight, 0.001, 100);
        visualization.camera.name = 'camera';
        visualization.camera.position.z = 0.225;
        visualization.camera.position.y = 1.6;
        visualization.camera.rotation.x = -45 * Math.PI / 180;
        visualization.scene.add(visualization.camera);
    }

    private addRenderer(visualization:Visualization): void {
        visualization.renderer = new WebGLRenderer({antialias: true});
        visualization.renderer.setPixelRatio(this.windowRef.nativeWindow.devicePixelRatio);
        visualization.renderer.setSize(visualization.sceneContainer.offsetWidth, visualization.sceneContainer.offsetHeight);
        visualization.renderer.setClearColor('#cef3e8', 1);

        visualization.sceneContainer.appendChild(visualization.renderer.domElement);
    }

    private removeRenderer(visualization:Visualization): void {
        while (visualization.sceneContainer.hasChildNodes()) {
            visualization.sceneContainer.removeChild(visualization.sceneContainer.lastChild);
        }
    }

    private addLighting(scene:Scene): void {
        let ambientLight = new AmbientLight('#ffffff', 0.1);
        ambientLight.name = 'ambientLight';
        scene.add(ambientLight);

        let directionalLight = new DirectionalLight('#ffffff', 0.5);
        directionalLight.name = 'directionalLight';
        directionalLight.position.x = -10;
        directionalLight.position.y = 10;
        directionalLight.position.z = 10;
        scene.add(directionalLight);

        let pointLight = new PointLight('#ffffff', 0.8);
        pointLight.name = 'pointLight';
        pointLight.position.y = 2.8;
        scene.add(pointLight);
    }

    private addTable(visualization:Visualization): void {
        let tableGroup = new Group();
        tableGroup.name = 'tableGroup';
        tableGroup.position.y = 1.3;

        let planeGeometry = new PlaneGeometry(20, 20, 1);
        let planeMaterial = new MeshPhongMaterial({color: '#CCB586', shininess: 0});
        let plane = new Mesh(planeGeometry, planeMaterial);
        plane.name = 'plane';
        plane.rotation.x = -90 * Math.PI / 180;
        plane.receiveShadow = true;
        tableGroup.add(plane);

        visualization.packageContainer = new Group();
        visualization.packageContainer.name = 'packageContainer';
        visualization.packageContainer.position.y = 2;
        tableGroup.add(visualization.packageContainer);

        visualization.centerContainer = new Group();
        visualization.centerContainer.name = 'centerContainer';
        tableGroup.add(visualization.centerContainer);

        visualization.scene.add(tableGroup);
    }

    private addResizeListener(visualization:Visualization): void {
        visualization.resizeListener = () => {
            visualization.camera.aspect = visualization.sceneContainer.offsetWidth / visualization.sceneContainer.offsetHeight;
            visualization.camera.updateProjectionMatrix();

            visualization.renderer.setSize(visualization.sceneContainer.offsetWidth, visualization.sceneContainer.offsetHeight);
        };

        this.windowRef.nativeWindow.addEventListener('resize', visualization.resizeListener, false);
    }

    private removeResizeListener(visualization:Visualization): void {
        this.windowRef.nativeWindow.removeEventListener('resize', visualization.resizeListener, false);
    }

    private removeAnimations(): void {
        TWEEN.removeAll();
    }

    private addAnimationFrameListener(visualization:Visualization): void {
        let render = (time:number) => {
            visualization.renderer.render(visualization.scene, visualization.camera);
            TWEEN.update(time);

            requestAnimationFrame(render);
        };

        visualization.animationFrameId = requestAnimationFrame(render);
    }

    private removeAnimationFrameListener(visualization:Visualization): void {
        cancelAnimationFrame(visualization.animationFrameId);
    }
    
    createWorld(visualization:Visualization, sceneContainer:HTMLElement): void {
        visualization.sceneContainer = sceneContainer;

        this.addScene(visualization);
        this.addCamera(visualization);
        this.addRenderer(visualization);
        this.addLighting(visualization.scene);
        this.addTable(visualization);

        this.addResizeListener(visualization);
        this.addAnimationFrameListener(visualization);

        visualization.ready.next(true);
    }
    
    destroyWorld(visualization:Visualization): void {
        this.removeAnimationFrameListener(visualization);
        this.removeResizeListener(visualization);
        this.removeRenderer(visualization);
        this.removeAnimations();
    }

    private sumParentPositions(element: Object3D): Vector3 {
        let vector:Vector3 = new Vector3();

          while (element) {
              vector.add(element.position);
              element = element.parent;
          }

          return vector;
    }

    private moveElementToParent(elementObject: Object3D, newParent: Group) {
        if (elementObject.userData.tween) elementObject.userData.tween.stop();

        let oldVector: Vector3 = this.sumParentPositions(elementObject);
        let newVector: Vector3 = this.sumParentPositions(newParent);

        let diff: Vector3 = oldVector.sub(newVector);

        elementObject.userData.tween = new TWEEN.Tween(diff)
            .to({x: 0, y: 0, z: 0}, 1000)
            .onUpdate(() => {
                elementObject.position.x = diff.x;
                elementObject.position.y = diff.y;
                elementObject.position.z = diff.z;
            }).easing(TWEEN.Easing.Quintic.Out);

        newParent.add(elementObject);
        elementObject.position.x = diff.x;
        elementObject.position.y = diff.y;
        elementObject.position.z = diff.z;
        elementObject.userData.tween.start();
    }

    private findParentObject(visualization:Visualization, parent:Parent): Group {
        let parentElement = visualization.elements.find(element => parent.id == element.id);
        let parentObject:Group = null;

        if (parent.id == 'centerContainer') {
            parentObject = visualization.centerContainer;
        } else if (parentElement && typeof parentElement.element.getTargetObject === 'function') {
             parentObject = parentElement.element.getTargetObject(parent.data);
        }

        if (!parentObject) {
            parentObject = visualization.packageContainer;
        }

        return parentObject;
    }

    private createParentFromData(parentData: any): Parent {
        let parent = new Parent();
        parent.id = parentData.id;
        parent.data = parentData.data;

        return parent;
    }

    addElement(visualization:Visualization, elementId:string, type:string, parentData:any, elementData:any): void {
        let element:Element = new Element();
        element.id = elementId;
        element.type = type;

        element.parent = this.createParentFromData(parentData);

        element.element = new ElementTypes[element.type](elementData, visualization.match);

        visualization.elements.push(element);

        visualization.packageContainer.add(element.element.object);

        if (element.parent.id) this.moveElementToParent(element.element.object, this.findParentObject(visualization, element.parent));
    }

    moveElement(visualization: Visualization, elementId: string, parentData: any): void {
        let element:Element = visualization.elements.find(element => element.id == elementId);
        element.parent = this.createParentFromData(parentData);

        this.moveElementToParent(element.element.object, this.findParentObject(visualization, element.parent));
    }

    removeElement(visualization: Visualization, elementId: string): void {
        let index = visualization.elements.findIndex(element => element.id == elementId);
        if (index > -1) {
            visualization.scene.remove(visualization.elements[index].element.object);
            visualization.elements.splice(index, 1);
        }
    }
}