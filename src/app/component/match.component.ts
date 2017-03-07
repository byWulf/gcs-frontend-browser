import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import * as TinyColor from 'tinycolor2';
import * as THREE from 'three';

import {Match, MatchState} from '../model/match';
import {User} from '../model/user';
import { EventCallbackError } from '../model/eventCallbackError';
import { Element } from '../model/match/element';
import { Parent } from '../model/match/parent';

import {MatchService} from '../service/match.service';
import {UserService} from '../service/user.service';
import {CommunicationService} from '../service/communication.service';

import * as ElementTypes from '../model/match/elementTypes';

declare const $:JQueryStatic;

@Component({
    moduleId: module.id,
    selector: 'my-match',
    templateUrl: './match.component.html',
    styleUrls: [ './match.component.css' ]
})

export class MatchComponent implements OnInit, OnDestroy {
    @ViewChild('scene') scene: ElementRef;

    match: Match = null;

    user: User;

    private userSub:Subscription;
    private updateSub:Subscription;

    MatchState = MatchState;
    TinyColor = TinyColor;

    elements: Element[] = [];

    constructor(
        private matchService: MatchService,
        private route: ActivatedRoute,
        private userService: UserService,
        private communicationService: CommunicationService
    ) {}

    ngOnInit(): void {
        this.route.params.switchMap((params: Params) => this.matchService.openMatch(params['id']))
            .subscribe(data => {
                if (data instanceof EventCallbackError) {
                    console.error('Error while opening match: ', data);
                    this.match = null;
                } else {
                    this.match = data;
                }
            });

        this.userSub = this.userService.userSubject.subscribe(user => {
            this.user = user;

            if (this.match) {
                this.matchService.openMatch(this.match.id).then(data => {
                    if (data instanceof EventCallbackError) {
                        console.error('Error while opening match: ', data);
                    } else {
                        this.match = data;
                    }
                });
            }
        });

    }

    ngAfterViewInit(): void {
        this.updateSub = this.communicationService.listen('match.update').subscribe(data => {
            if (!this.match) return;

            if (data.key === 'slots') {
                this.match.slots = data.data;
            }

            if (data.key == 'state') {
                this.match.state = data.data
            }

            if (data.key == 'event') {
                this.handleGameEvent(data.data);
            }
        });

        console.log("init", $('.sceneContainer'));

        $( `<a-scene #scene>
                <a-sky color="#6EBAA7"></a-sky>
                <a-light type="ambient" intensity="0.5"></a-light>
        
                <a-entity position="0 1.3 0">
                    <a-plane color="#CCB586" height="20" width="20" rotation="-90 0 0" shadow="cast: false; receive: true;"></a-plane>
                    <a-light position="0 1 0" intensity="1" type="point" distance="2" light="castShadow: true;"></a-light>
        
                    <a-entity id="packageContainer" position="0 2 0"></a-entity>
                    <a-entity id="centerContainer"></a-entity>
                </a-entity>
        
                <a-camera rotation="-45 0 0" position="0 0 0.225" wasd-controls="enabled: false;" look-controls="enabled: false"></a-camera>
        
                <a-light type="directional" intensity="0.3" position="-10 10 10"></a-light>
            </a-scene>`).appendTo('.sceneContainer');
    }

    ngOnDestroy(): void {
        this.matchService.closeMatch().then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while closing match: ', data);
            }
        });

        this.userSub.unsubscribe();
        this.updateSub.unsubscribe();
    }

    isLoggedIn(): boolean {
        return this.user && this.user.id > 0;
    }

    isMe(user:User): boolean {
        return user && user.id === this.user.id;
    }

    isJoined(): boolean {
        for (let slot of this.match.slots) {
            if (slot.user !== null && slot.user.id === this.user.id) {
                return true;
            }
        }

        return false;
    }

    join(index:number) {
        this.matchService.joinMatch(this.match, index).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while joining match: ', data);
            }
        });
    }

    leave() {
        this.matchService.leaveMatch(this.match).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while leaving match: ', data);
            }
        });
    }

    cancel() {
        this.matchService.cancelMatch(this.match).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while canceling match: ', data);
            }
        });
    }

    start() {
        this.matchService.startMatch(this.match).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while starting match: ', data);
            }
        });
    }

    switchSlot(index:number) {
        this.matchService.switchSlot(this.match, index).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while switching slot: ', data);
            }
        });
    }

    lightenColor(color: string): string {
        let newColor:string = TinyColor(color).brighten(80).desaturate(20).toString();
        return newColor
    }

    private positionToVector(position:any): THREE.Vector3 {
      return new THREE.Vector3(position.x, position.y, position.z);
    }

    private vectorToPosition(vector: THREE.Vector3): Object {
      return {
        x: vector.getComponent(0),
        y: vector.getComponent(1),
        z: vector.getComponent(2)
      }
    }

    private sumVectors(elements: HTMLElement[]): THREE.Vector3 {
      let vector = new THREE.Vector3();
      for (let i = 0; i < elements.length; i++) {
        let position = elements[i].getAttribute('position');
        vector.add(this.positionToVector(position));
      }

      return vector;
    }

    private animateParentChange(element: JQuery, newParent: JQuery) {
      let newParentParents = newParent.prop('tagName') == 'A-SCENE' ? [] : newParent.add(newParent.parentsUntil('a-scene')).toArray();
      let elementParents = element.parentsUntil('a-scene').toArray();

      console.log("animateParentChanges", newParent.prop('tagName'), newParentParents, elementParents);

      let oldVector = this.sumVectors(elementParents);
      let newVector = this.sumVectors(newParentParents);

      let diff = oldVector.sub(newVector);

      let newPosition = this.vectorToPosition(diff);

      $(element).find('a-animate').remove();
      $(element).appendTo(newParent);
      $(element).append('<a-animation attribute="position" dur="1000" fill="forwards" from="' + diff.toArray().join(' ') + '" to="0 0 0"></a-animation>');
    }

    private moveElementToParent(element:Element, parent:Parent): void {
        let parentElement = this.elements.find(element => parent.id == element.id);
        let targetParent = $('a-entity#packageContainer');

        if (parentElement && typeof parentElement.element.getTarget === 'function') {
             let target:string = parentElement.element.getTarget(parent.data);

             console.log("function -> target = ", target, '#' + parent.id);
             targetParent = $('#' + parent.id + ' ' + target);
        } else if ($('#' + parent.id).length) {
            targetParent = $('#' + parent.id);
        }

        console.log('moveElementToParent', $('#' + element.id), targetParent);
        this.animateParentChange($('#' + element.id), targetParent);
    }

    private addElement(id:string, type:string, parentData:any, elementData:any) {
        let element:Element = new Element();
        element.id = id;
        element.type = type;

        let parent = new Parent();
        parent.id = parentData.id;
        parent.data = parentData.data;
        element.parent = parent;

        let elementType = new ElementTypes[element.type](elementData);
        element.element = elementType;

        this.elements.push(element);

        let domElement = $('<a-entity></a-entity>');
        domElement.attr('id', id);
        domElement.append(elementType.render());

        $('a-entity#packageContainer').append(domElement);
        this.moveElementToParent(element, parent);
    }

    private handleGameEvent(data: any): void {
        console.log("got event from game", data);

        if (data.event == 'element.added') {
            this.addElement(data.id, data.type, data.parent, data.element);
        }

        if (data.event == 'element.moved') {
            let newParent:Parent = data.parent;

            let element:Element = this.elements.find(element => element.id == data.id);
            element.parent = newParent;

            this.moveElementToParent(element, newParent);
        }

        if (data.event == 'element.removed') {
            let index = this.elements.findIndex(element => element.id == data.id);
            if (index > -1) this.elements.splice(index, 1);

            $('#' + data.id).remove();
        }
    }
}