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

import {
    World,
    NaiveBroadphase,
    Material,
    Body,
    Plane
} from 'cannon';

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

    private addWorld(visualization:Visualization): void {
        visualization.world = new World();

        visualization.world.gravity.y = -9.82 * 20;
        visualization.world.broadphase = new NaiveBroadphase();
        visualization.world.solver.iterations = 16;

        visualization.elementBodyMaterial = new Material('elementBodyMaterial');
        visualization.environmentBodyMaterial = new Material('environmentBodyMaterial');

        visualization.world.addContactMaterial(
            new CANNON.ContactMaterial(visualization.environmentBodyMaterial,   visualization.elementBodyMaterial, {friction: 0.01, restitution: 0.5})
        );
        visualization.world.addContactMaterial(
            new CANNON.ContactMaterial(visualization.elementBodyMaterial,    visualization.elementBodyMaterial, {friction: 0, restitution: 0.5})
        );

        this.windowRef.nativeWindow.world = visualization.world;
    }

    private addCamera(visualization:Visualization): void {
        visualization.camera = new PerspectiveCamera(75, visualization.sceneContainer.offsetWidth / visualization.sceneContainer.offsetHeight, 0.1, 10000);
        visualization.camera.name = 'camera';
        visualization.camera.position.z = 30;

        visualization.cameraRotationContainer = new Group();
        visualization.cameraRotationContainer.name = 'cameraRotationContainer';
        visualization.cameraRotationContainer.rotation.x = -45 * Math.PI / 180;

        visualization.cameraPositionContainer = new Group();
        visualization.cameraPositionContainer.name = 'cameraPositionContainer';
        visualization.cameraPositionContainer.position.x = 0;
        visualization.cameraPositionContainer.position.z = 0;
        visualization.cameraPositionContainer.position.y = 130;

        visualization.cameraRotationContainer.add(visualization.camera);
        visualization.cameraPositionContainer.add(visualization.cameraRotationContainer);
        visualization.scene.add(visualization.cameraPositionContainer);

        visualization.mousedownListener = (event:MouseEvent) => {
            if (event.button == 0 || event.button == 2) {
                visualization.sceneContainer.requestPointerLock();
            }
        };

        visualization.mouseupListener = (event:MouseEvent) => {
            if (event.button == 0 || event.button == 2) {
                visualization.sceneContainer.ownerDocument.exitPointerLock();
            }
        };

        visualization.mousemoveListener = (event:MouseEvent) => {
            if (visualization.buttonLocked) {
                if (event.button == 0) {
                    visualization.cameraPositionContainer.position.x = Math.max(Math.min(visualization.cameraPositionContainer.position.x + event.movementX * -0.1, 100), -100);
                    visualization.cameraPositionContainer.position.z = Math.max(Math.min(visualization.cameraPositionContainer.position.z + event.movementY * -0.1, 100), -100);
                }

                if (event.button == 2) {
                    visualization.cameraRotationContainer.rotation.x = Math.max(Math.min((visualization.cameraRotationContainer.rotation.x / Math.PI * 180) + event.movementY * -0.3, -5), -90) * Math.PI / 180
                }
            }
        };

        visualization.pointerlockchangeListener = (event:Event) => {
            visualization.buttonLocked = document.pointerLockElement === visualization.sceneContainer;
        };

        visualization.mousewheelListener = (event:WheelEvent) => {
	        let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

	        visualization.camera.position.z = Math.max(Math.min(visualization.camera.position.z + delta * -1, 100), 5);
        };

        visualization.sceneContainer.addEventListener('mousewheel', visualization.mousewheelListener, false);
        visualization.sceneContainer.addEventListener('DOMMouseScroll', visualization.mousewheelListener, false);
        visualization.sceneContainer.addEventListener('mousedown', visualization.mousedownListener, false);
        visualization.sceneContainer.addEventListener('mouseup', visualization.mouseupListener, false);
        visualization.sceneContainer.addEventListener('mousemove', visualization.mousemoveListener, false);
        visualization.sceneContainer.ownerDocument.addEventListener('pointerlockchange', visualization.pointerlockchangeListener, false);
    }

    private removeCamera(visualization:Visualization): void {
        visualization.sceneContainer.ownerDocument.exitPointerLock();

        visualization.sceneContainer.removeEventListener('mousewheel', visualization.mousewheelListener, false);
        visualization.sceneContainer.removeEventListener('DOMMouseScroll', visualization.mousewheelListener, false);
        visualization.sceneContainer.removeEventListener('mousedown', visualization.mousedownListener, false);
        visualization.sceneContainer.removeEventListener('mouseup', visualization.mouseupListener, false);
        visualization.sceneContainer.removeEventListener('mousemove', visualization.mousemoveListener, false);
        visualization.sceneContainer.ownerDocument.removeEventListener('pointerlockchange', visualization.pointerlockchangeListener, false);
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
        directionalLight.position.x = -1000;
        directionalLight.position.y = 1000;
        directionalLight.position.z = 1000;
        scene.add(directionalLight);

        let pointLight = new PointLight('#ffffff', 0.8);
        pointLight.name = 'pointLight';
        pointLight.position.y = 280;
        scene.add(pointLight);
    }

    private addTable(visualization:Visualization): void {
        let tableGroup = new Group();
        tableGroup.name = 'tableGroup';
        tableGroup.position.y = 130;

        let planeGeometry = new PlaneGeometry(2000, 2000, 1);
        let planeMaterial = new MeshPhongMaterial({color: '#CCB586', shininess: 0});
        let plane = new Mesh(planeGeometry, planeMaterial);
        plane.name = 'plane';
        plane.rotation.x = -90 * Math.PI / 180;
        plane.receiveShadow = true;
        tableGroup.add(plane);

        let planeBody = new Body({mass: 0});
        planeBody.addShape(new Plane());
        planeBody.material = visualization.environmentBodyMaterial;
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        visualization.world.add(planeBody);

        visualization.packageContainer = new Group();
        visualization.packageContainer.name = 'packageContainer';
        visualization.packageContainer.position.y = 200;
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

            visualization.world.step(1.0 / 60.0);

            for (let element of visualization.elements) {
                if (typeof element.element.onRendered === 'function') {
                    element.element.onRendered();
                }
            }

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
        this.addWorld(visualization);
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
        this.removeCamera(visualization);
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

        if (parentData) {
            parent.id = parentData.id;
            parent.data = parentData.data;
        }

        return parent;
    }

    addElement(visualization:Visualization, elementId:string, type:string, parentData:any, elementData:any): void {
        let element:Element = new Element();
        element.id = elementId;
        element.type = type;

        element.parent = this.createParentFromData(parentData);

        element.element = new ElementTypes[element.type](elementData, visualization);
        element.element.object.userData.element = element;

        visualization.elements.push(element);

        visualization.packageContainer.add(element.element.object);

        if (element.parent.id) this.moveElementToParent(element.element.object, this.findParentObject(visualization, element.parent));
    }

    moveElement(visualization: Visualization, elementId: string, parentData: any): void {
        let element:Element = visualization.elements.find(element => element.id == elementId);

        let parentElement = visualization.elements.find(parentElement => parentElement.id == element.parent.id);
        let directParentObject:Group = element.element.object.parent;

        element.parent = this.createParentFromData(parentData);
        this.moveElementToParent(element.element.object, this.findParentObject(visualization, element.parent));

        if (parentElement && typeof parentElement.element.onChildRemoved == 'function') {
            parentElement.element.onChildRemoved(directParentObject);
        }
    }

    removeElement(visualization: Visualization, elementId: string): void {
        let index = visualization.elements.findIndex(element => element.id == elementId);
        if (index > -1) {

            let parentElement = visualization.elements.find(parentElement => parentElement.id == visualization.elements[index].parent.id);
            let directParentObject:Group = visualization.elements[index].element.object.parent;

            visualization.scene.remove(visualization.elements[index].element.object);
            visualization.elements.splice(index, 1);

            if (parentElement && typeof parentElement.element.onChildRemoved == 'function') {
                parentElement.element.onChildRemoved(directParentObject);
            }
        }
    }

    handleGameEvent(visualization:Visualization, data: any): void {
        if (data.event == 'element.added') {
            this.addElement(visualization, data.id, data.type, data.parent, data.element);
        }

        if (data.event == 'element.moved') {
            this.moveElement(visualization, data.id, data.parent);
        }

        if (data.event == 'element.removed') {
            this.removeElement(visualization, data.id);
        }

        let element:Element = visualization.elements.find(element => element.id == data.id);
        if (element && typeof element.element.onEvent === 'function') {
            element.element.onEvent(data.event, data);
        }
    }
}