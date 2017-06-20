import {ApplicationRef, Component, ElementRef, ViewChild} from '@angular/core';
import {Visualization} from 'gcs-frontend-browser-matchvisualization-3d';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Router} from "@angular/router";
import {WindowRefService} from "../service/windowRef.service";

@Component({
    moduleId: module.id,
    templateUrl: './game-create.component.html',
    styleUrls: [ './game-create.component.css' ]
})

export class GameCreateComponent {
    @ViewChild('sceneContainer') sceneContainerRef: ElementRef;

    visualization:Visualization;
    visualizationReady:BehaviorSubject<boolean> = new BehaviorSubject(false);

    bulkCreateKey:string = null;
    bulkCreateCount:number = 0;
    elementTypes = [{
            key: 'autoResizeContainer_v1',
            label: 'Autoresize-Container',
            options: [
                {
                    key: 'spacing',
                    label: 'Abstand zwischen den Containerbereichen',
                    type: 'length'
                }
            ]
        },{
            key: 'board_v1',
            label: 'Spielbrett',
            labelPlural: 'Spielbretter',
            options: [
                {
                    key: 'width',
                    label: 'Breite',
                    type: 'length',
                    defaultValue: 30
                },
                {
                    key: 'height',
                    label: 'Tiefe',
                    type: 'length',
                    defaultValue: 20
                },{
                    key: 'image',
                    label: 'Bild der Oberfläche',
                    type: 'image'
                }
            ]
        },{
            key: 'button_v1',
            label: 'Button',
            labelPlural: 'Button',
            options: [
                {
                    key: 'label',
                    label: 'Beschriftung',
                    type: 'text',
                    defaultValue: 'Beschriftung'
                },{
                    key: 'canBeClicked',
                    type: 'hidden',
                    defaultValue: true
                }
            ]
        },{
            key: 'card_v1',
            label: 'Karte',
            labelPlural: 'Karten',
            options: [
                {
                    key: 'frontImage',
                    label: 'Bild der Vorderseite',
                    type: 'image'
                },{
                    key: 'backImage',
                    label: 'Bild der Rückseite',
                    type: 'image'
                },{
                    key: 'side',
                    label: 'Initiale Seite oben',
                    type: 'select',
                    values: [
                        {
                            key: 'front',
                            label: 'Vorderseite'
                        },{
                            key: 'back',
                            label: 'Rückseite'
                        }
                    ],
                    defaultValue: 'back'
                },{
                    key: 'rotation',
                    label: 'Initiale Rotation',
                    type: 'rotation',
                    defaultValue: 0
                },{
                    key: 'width',
                    label: 'Breite',
                    type: 'length',
                    defaultValue: 6
                },
                {
                    key: 'height',
                    label: 'Höhe',
                    type: 'length',
                    defaultValue: 9
                },
                {
                    key: 'depth',
                    label: 'Dicke',
                    type: 'length',
                    defaultValue: 0.03
                },
                {
                    key: 'cornerRadius',
                    label: 'Radius der Eckenabrundung',
                    type: 'length',
                    defaultValue: 0.5
                },
                {
                    key: 'canBeMovedTo',
                    type: 'hidden',
                    defaultValue: []
                },
                {
                    key: 'canBeRotatedTo',
                    type: 'hidden',
                    defaultValue: []
                }
            ],
            bulk: {
                type: 'file',
                key: 'frontImage'
            }
        },{
            key: 'cardContainer_v1',
            label: 'Kartenstapel (Container für Karten)',
            labelPlural: 'Kartenstapel (Container für Karten)',
            options: [
                {
                    key: 'cardWidth',
                    label: 'Breite der aufnehmenden Karten',
                    type: 'length',
                    defaultValue: 6
                },
                {
                    key: 'cardHeight',
                    label: 'Höhe der aufnehmenden Karten',
                    type: 'length',
                    defaultValue: 9
                },
                {
                    key: 'cardDepth',
                    label: 'Dicke der aufnehmenden Karten',
                    type: 'length',
                    defaultValue: 0.03
                },
                {
                    key: 'cardCornerRadius',
                    label: 'Radius der Eckenabrundung der aufnehmenden Karten',
                    type: 'length',
                    defaultValue: 0.5
                },
                {
                    key: 'spacing',
                    label: 'Abstand zwischen den Kartenstapeln',
                    type: 'length',
                    defaultValue: 1
                },
                {
                    key: 'stackShattering',
                    label: 'Ordnung der Karten auf einem Stapel',
                    type: 'select',
                    values: [
                        {
                            key: 'ordered',
                            label: 'Ordendlich'
                        },{
                            key: 'little',
                            label: 'Leicht unregelmäßig'
                        },{
                            key: 'shattered',
                            label: 'Sehr unordendlich'
                        }
                    ],
                    defaultValue: 'ordered'
                }
            ]
        },{
            key: 'dice_v1',
            label: 'Würfel',
            labelPlural: 'Würfel',
            options: [
                {
                    key: 'value',
                    label: 'Initialer Wert oben',
                    type: 'select',
                    values: [
                        {
                            key: 1,
                            value: '1'
                        },
                        {
                            key: 2,
                            value: '2'
                        },
                        {
                            key: 3,
                            value: '3'
                        },
                        {
                            key: 4,
                            value: '4'
                        },
                        {
                            key: 5,
                            value: '5'
                        },
                        {
                            key: 6,
                            value: '6'
                        },
                    ],
                    defaultValue: 6
                }
            ],
            bulk: {
                type: 'count'
            }
        },{
            key: 'piece_v1',
            label: 'Spielfigur',
            labelPlural: 'Spielfiguren',
            options: [
                {
                    key: 'model',
                    label: 'Model',
                    type: 'model'
                },{
                    key: 'color',
                    label: 'Farbe',
                    type: 'color',
                    defaultValue: '#000000'
                },
                {
                    key: 'canBeMovedTo',
                    type: 'hidden',
                    defaultValue: []
                }
            ],
            bulk: {
                type: 'count'
            }
        },{
            key: 'pieceContainer_v1',
            label: 'Spielfigur-Positionen',
            labelPlural: 'Spielfigur-Positionen',
            options: [
                {
                    key: 'stackElementRadius',
                    label: 'Breite der aufzunehmenden Spielfiguren',
                    type: 'length',
                    defaultValue: 1
                },
                {
                    key: 'positions',
                    type: 'hidden',
                    defaultValue: []
                }
            ]
        },{
            key: 'tile_v1',
            label: 'Plättchen',
            labelPlural: 'Plättchen',
            options: [
                {
                    key: 'frontImage',
                    label: 'Bild der Vorderseite',
                    type: 'image'
                },{
                    key: 'backImage',
                    label: 'Bild der Rückseite',
                    type: 'image'
                },{
                    key: 'side',
                    label: 'Initiale Seite oben',
                    type: 'select',
                    values: [
                        {
                            key: 'front',
                            label: 'Vorderseite'
                        },{
                            key: 'back',
                            label: 'Rückseite'
                        }
                    ],
                    defaultValue: 'back'
                },{
                    key: 'rotation',
                    label: 'Initiale Rotation',
                    type: 'rotation',
                    defaultValue: 0
                },{
                    key: 'radius',
                    label: 'Breite',
                    type: 'length',
                    defaultValue: 5
                },
                {
                    key: 'height',
                    label: 'Dicke',
                    type: 'length',
                    defaultValue: 0.2
                },
                {
                    key: 'form',
                    label: 'Form',
                    type: 'select',
                    values: [
                        {
                            key: 'square',
                            label: 'quadratisch'
                        },{
                            key: 'hexagonal',
                            label: 'sechseckig'
                        }
                    ],
                    defaultValue: 'square'
                },
                {
                    key: 'canBeMovedTo',
                    type: 'hidden',
                    defaultValue: []
                },
                {
                    key: 'canBeRotatedTo',
                    type: 'hidden',
                    defaultValue: []
                }
            ],
            bulk: {
                type: 'file',
                key: 'frontImage'
            }
        },{
            key: 'tileContainer_v1',
            label: 'Plättchenanordnung (Container für Plättchen)',
            labelPlural: 'Plättchenanordnungen (Container für Plättchen)',
            options: [
                {
                    key: 'stackElementRadius',
                    label: 'Breite der aufnehmenden Plättchen',
                    type: 'length',
                    defaultValue: 5
                },
                {
                    key: 'stackElementHeight',
                    label: 'Dicke der aufnehmenden Plättchen',
                    type: 'length',
                    defaultValue: 0.2
                },
                {
                    key: 'stackElementSpacing',
                    label: 'Abstand zwischen den Plättchen',
                    type: 'length',
                    defaultValue: 0.2
                }
            ]
        }
    ];
    elements:any = [];
    currentElementIndex:number = null;

    constructor(
        private windowRef: WindowRefService,
        private router: Router,
        private applicationRef:ApplicationRef
    ) {}

    ngOnInit(): void {
        this.visualizationReady.next(false);

        if (this.visualization) {
            this.visualization.destroy();
            this.visualization = null;
        }

        this.visualizationReady.subscribe(ready => {
            if (ready) {
                this.visualization = new Visualization(this.windowRef.nativeWindow, this.sceneContainerRef.nativeElement, 'game-creator', null, [], null);
            }
        });
    }

    ngAfterViewInit(): void {
        this.visualizationReady.next(true);
    }

    addElement(typeKey, options?): boolean {
        let definition = this.getElementDefinition(typeKey);

        let count = 1;
        for (let element of this.elements) {
            if (element.type == typeKey) {
                count++;
            }
        }

        let element = {
            id: typeKey + '_' + count,
            type: typeKey,
            parent: {
                id: 'packageContainer'
            },
            element: {}
        };

        for (let option of definition.options) {
            element.element[option.key] = options ? options[option.key] : (option.defaultValue || null);
        }

        this.elements.push(element);

        this.visualization.handleGameEvent('element.added', element);

        this.selectElement(this.elements.length - 1);

        return false;
    }

    selectElement(index): boolean {
        for (let i in this.elements) {
            if (!this.elements.hasOwnProperty(i)) continue;

            if (i == index && this.elements[i].parent.id != 'tableContainer') {
                this.elements[i].parent = {id: 'tableContainer'};
                this.visualization.handleGameEvent('element.moved', this.elements[i]);
            } else if (i != index && this.elements[i].parent.id != 'packageContainer') {
                this.elements[i].parent = {id: 'packageContainer'};
                this.visualization.handleGameEvent('element.moved', this.elements[i]);
            }
        }

        this.currentElementIndex = index;

        return false;
    }

    getElementDefinition(typeKey): any {
        for (let type of this.elementTypes) {
            if (type.key == typeKey) {
                return type;
            }
        }

        return null;
    }
    getOptionDefinition(typeKey, optionKey): any {
        let definition = this.getElementDefinition(typeKey);

        for (let i = 0; i < definition.options.length; i++) {
            if (definition.options[i].key == optionKey) {
                return definition.options[i];
            }
        }

        return null;
    }

    transformAttributeValue(typeKey:string, optionKey:string, inputElement:HTMLElement, fileIndex:number = 0): any {
        let optionDefinition = this.getOptionDefinition(typeKey, optionKey);

        if (['rotation', 'length'].indexOf(optionDefinition.type) > -1) {
            return parseFloat(inputElement['value']);
        }

        if (['image'].indexOf(optionDefinition.type) > -1) {
            let imgElement = document.createElement('img');

            if (typeof inputElement['files'][fileIndex] != 'undefined') {
                let reader = new FileReader();
                reader.onload = function () {
                    imgElement.src = reader.result;
                };
                reader.readAsDataURL(inputElement['files'][fileIndex]);
            }

            return imgElement;
        }

        if (['model'].indexOf(optionDefinition.type) > -1) {
            let modelObject = {type: 'model', content: null, onload: null};

            if (typeof inputElement['files'][fileIndex] != 'undefined') {
                let reader = new FileReader();
                reader.onload = function () {
                    modelObject.content = reader.result;
                    if (typeof modelObject.onload == 'function') {
                        modelObject.onload();
                    }
                };
                reader.readAsText(inputElement['files'][fileIndex]);
            }

            return modelObject;
        }

        return inputElement['value'];
    }

    updateAttribute(key, value): boolean {
        if (this.currentElementIndex === null) return false;

        let currentElement = this.elements[this.currentElementIndex];

        currentElement.element[key] = this.transformAttributeValue(currentElement.type, key, document.getElementById('game-create-attributes-' + key));

        this.visualization.handleGameEvent('element.removed', currentElement);
        this.visualization.handleGameEvent('element.added', currentElement);
    }

    startBulkCreate(typeKey): boolean {
        this.bulkCreateKey = null;
        this.applicationRef.tick();

        this.bulkCreateKey = typeKey;
        this.bulkCreateCount = 0;

        $('#bulkCreateModal')['modal']('show');

        return false;
    }

    bulkCreate(): boolean {
        let definition = this.getElementDefinition(this.bulkCreateKey);


        for (let i = 0; i < this.bulkCreateCount; i++) {
            let options = {};
            for (let option of definition.options) {
                if (definition.bulk.type == 'file' && definition.bulk.key == option.key) {
                    options[option.key] = this.transformAttributeValue(this.bulkCreateKey, option.key, document.getElementById('game-create-bulkcreate-' + option.key), i);
                } else if (option.type == 'hidden') {
                    options[option.key] = option.defaultValue;
                } else {
                    options[option.key] = this.transformAttributeValue(this.bulkCreateKey, option.key, document.getElementById('game-create-bulkcreate-' + option.key));
                }
            }

            this.addElement(this.bulkCreateKey, options);
        }

        $('#bulkCreateModal')['modal']('hide');

        return false;
    }

    setBulkCountByFileInput(): void {
        this.bulkCreateCount = document.getElementById('game-create-bulkcreate-' + this.getElementDefinition(this.bulkCreateKey).bulk.key)['files'].length;
    }
}