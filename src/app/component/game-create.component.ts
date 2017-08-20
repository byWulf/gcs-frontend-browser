import {ApplicationRef, Component, ElementRef, ViewChild} from '@angular/core';
import {Visualization} from 'gcs-frontend-browser-matchvisualization-3d';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {WindowRefService} from "../service/windowRef.service";
import {RecursiveTreeComponent} from "./game-create/recursiveTree.component";

@Component({
    moduleId: module.id,
    templateUrl: './game-create.component.html',
    styleUrls: [ './game-create.component.css' ]
})

export class GameCreateComponent {
    @ViewChild('sceneContainer') sceneContainerRef: ElementRef;

    visualization:Visualization;
    visualizationReady:BehaviorSubject<boolean> = new BehaviorSubject(false);

    elementTypes = [{
            key: 'autoResizeContainer_v1',
            idPrefix: 'autoResizeContainer',
            label: 'Autoresize-Container',
            labelPlural: 'Autoresize-Container',
            options: [
                {
                    key: 'spacing',
                    label: 'Abstand zwischen den Containerbereichen',
                    type: 'length'
                }
            ],
            changeable: [],
            targetOptions: [
                {
                    key: 'x',
                    label: 'X-Position',
                    type: 'number',
                    defaultValue: 0
                },
                {
                    key: 'y',
                    label: 'Y-Position',
                    type: 'number',
                    defaultValue: 0
                }
            ]
        },{
            key: 'board_v1',
            idPrefix: 'board',
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
            ],
            changeable: [],
            targetOptions: []
        },{
            key: 'button_v1',
            idPrefix: 'button',
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
            ],
            changeable: [],
            onShow: (element) => { this.visualization.handleGameEvent('button.permissionChanged', {id: element.id, canBeClicked: true}) },
            onHide: (element) => { this.visualization.handleGameEvent('button.permissionChanged', {id: element.id, canBeClicked: false}) },
            targetOptions: null
        },{
            key: 'card_v1',
            idPrefix: 'card',
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
            },
            changeable: [
                {
                    key: 'card.sideChanged',
                    label: '(Karte) Seite',
                    type: 'select',
                    values: [
                        {
                            key: 'front',
                            label: 'Vorderseite'
                        },{
                            key: 'back',
                            label: 'Rückseite'
                        },{
                            key: 'flip',
                            label: 'Umdrehen (je nachdem)'
                        }
                    ],
                    defaultValue: 'flip'
                },
                {
                    key: 'card.rotationChanged',
                    label: '(Karte) Rotation',
                    type: 'rotation',
                    defaultValue: 0
                },
                {
                    key: 'card.selectionChanged',
                    label: '(Karte) markiert',
                    type: 'select',
                    values: [
                        {
                            key: 'true',
                            label: 'Ausgewählt'
                        },{
                            key: 'false',
                            label: 'Nicht ausgewählt'
                        },{
                            key: 'switch',
                            label: 'Ändern (je nachdem)'
                        }
                    ],
                    defaultValue: 'switch'
                }
            ],
            targetOptions: []
        },{
            key: 'cardContainer_v1',
            idPrefix: 'cardContainer',
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
            ],
            changeable: [],
            targetOptions: [
                {
                    key: 'position',
                    label: 'X-Position',
                    type: 'number',
                    defaultValue: 0
                },
                {
                    key: 'indexMode',
                    label: 'Z-Index-Modus',
                    type: 'select',
                    values: [
                        {
                            key: 'random',
                            label: 'Zufall'
                        },
                        {
                            key: 'top',
                            label: 'Ganz oben'
                        },
                        {
                            key: 'bottom',
                            label: 'Ganz unten'
                        },
                        {
                            key: 'fixed',
                            label: 'Festgelegter Z-Index'
                        }
                    ],
                    defaultValue: 'fixed'
                },
                {
                    key: 'index',
                    label: 'Z-Index',
                    type: 'number',
                    defaultValue: 0,
                    onlyIf: (targetOptions) => targetOptions.indexMode == 'fixed'
                }
            ]
        },{
            key: 'dice_v1',
            idPrefix: 'dice',
            label: 'Würfel',
            labelPlural: 'Würfel',
            options: [
                {
                    key: 'value',
                    label: 'Initialer Wert oben',
                    type: 'select',
                    values: [{
                            key: 1,
                            label: '1'
                        },
                        {
                            key: 2,
                            label: '2'
                        },
                        {
                            key: 3,
                            label: '3'
                        },
                        {
                            key: 4,
                            label: '4'
                        },
                        {
                            key: 5,
                            label: '5'
                        },
                        {
                            key: 6,
                            label: '6'
                        },
                    ]
                }
            ],
            bulk: {
                type: 'count'
            },
            changeable: [
                {
                    key: 'dice.rolled',
                    label: '(Würfel) angezeigter Wert',
                    type: 'select',
                    values: [
                        {
                            key: 'random',
                            label: 'Zufall (neu würfeln)'
                        },{
                            key: '1',
                            label: '1'
                        },{
                            key: '2',
                            label: '2'
                        },{
                            key: '3',
                            label: '3'
                        },{
                            key: '4',
                            label: '4'
                        },{
                            key: '5',
                            label: '5'
                        },{
                            key: '6',
                            label: '6'
                        }
                    ],
                    defaultValue: 'random'
                }
            ],
            targetOptions: null
        },{
            key: 'piece_v1',
            idPrefix: 'piece',
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
            },
            changeable: [
                {
                    key: 'piece.layingChanged',
                    label: '(Figur) liegend',
                    type: 'select',
                    values: [
                        {
                            key: 'laying',
                            label: 'Liegend'
                        },{
                            key: 'standing',
                            label: 'Stehend'
                        },{
                            key: 'switch',
                            label: 'Ändern (je nachdem)'
                        }
                    ],
                    defaultValue: 'switch'
                }
            ],
            targetOptions: null
        },{
            key: 'pieceContainer_v1',
            idPrefix: 'pieceContainer',
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
                    label: 'Positionen',
                    type: 'pieceContainer_v1_positions',
                    defaultValue: []
                }
            ],
            changeable: [],
            targetOptions: [
                {
                    key: 'index',
                    label: 'Feld-Index',
                    type: 'number',
                    defaultValue: 0
                }
            ]
        },{
            key: 'tile_v1',
            idPrefix: 'tile',
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
            },
            changeable: [
                {
                    key: 'tile.sideChanged',
                    label: '(Plättchen) Seite',
                    type: 'select',
                    values: [
                        {
                            key: 'front',
                            label: 'Vorderseite'
                        },{
                            key: 'back',
                            label: 'Rückseite'
                        },{
                            key: 'flip',
                            label: 'Umdrehen (je nachdem)'
                        }
                    ],
                    defaultValue: 'flip'
                },
                {
                    key: 'tile.rotationChanged',
                    label: '(Plättchen) Rotation',
                    type: 'rotation',
                    defaultValue: 0
                }
            ],
            targetOptions: []
        },{
            key: 'tileContainer_v1',
            idPrefix: 'tileContainer',
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
            ],
            changeable: [],
            targetOptions: [
                {
                    key: 'x',
                    label: 'X-Position',
                    type: 'number',
                    defaultValue: 0
                },
                {
                    key: 'y',
                    label: 'Y-Position',
                    type: 'number',
                    defaultValue: 0
                },
                {
                    key: 'indexMode',
                    label: 'Z-Index-Modus',
                    type: 'select',
                    values: [
                        {
                            key: 'random',
                            label: 'Zufall'
                        },
                        {
                            key: 'top',
                            label: 'Ganz oben'
                        },
                        {
                            key: 'bottom',
                            label: 'Ganz unten'
                        },
                        {
                            key: 'fixed',
                            label: 'Festgelegter Z-Index'
                        }
                    ],
                    defaultValue: 'fixed'
                },
                {
                    key: 'index',
                    label: 'Z-Index',
                    type: 'number',
                    defaultValue: 0,
                    onlyIf: (targetOptions) => targetOptions.indexMode == 'fixed'
                }
            ]
        }
    ];
    elements:any = [];
    currentElementIndex:number = null;

    constructor(
        private windowRef: WindowRefService,
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

    // noinspection JSUnusedGlobalSymbols
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
            id: definition.idPrefix + '_' + count,
            type: typeKey,
            parent: {
                id: 'packageContainer'
            },
            element: {},
            tags: options ? options.tags.slice() : []
        };

        for (let option of definition.options) {
            let value = option.defaultValue || null;
            if (options) {
                value = options[option.key];
            }

            if (value instanceof Array) {
                value = value.slice();
            }
            element.element[option.key] = value;
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

                let definition = this.getElementDefinition(this.elements[i].type);
                if (typeof definition.onShow == 'function') {
                    definition.onShow(this.elements[i]);
                }
            } else if (i != index && this.elements[i].parent.id != 'packageContainer') {
                this.elements[i].parent = {id: 'packageContainer'};
                this.visualization.handleGameEvent('element.moved', this.elements[i]);

                let definition = this.getElementDefinition(this.elements[i].type);
                if (typeof definition.onHide == 'function') {
                    definition.onHide(this.elements[i]);
                }
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

    updateAttribute(key): boolean {
        if (this.currentElementIndex === null) return false;

        let currentElement = this.elements[this.currentElementIndex];

        currentElement.element[key] = this.transformAttributeValue(currentElement.type, key, document.getElementById('game-create-attributes-' + key));

        this.visualization.handleGameEvent('element.removed', currentElement);
        this.visualization.handleGameEvent('element.added', currentElement);
    }

    getElementById(id) {
        for (let element of this.elements) {
            if (element.id == id) {
                return element;
            }
        }

        return null;
    }

    /**
     * Bulk creation
     */
    bulkCreateKey:string = null;
    bulkCreateCount:number = 0;
    bulkCreateTags = [];

    startBulkCreate(typeKey): boolean {
        this.bulkCreateKey = null;
        this.applicationRef.tick();

        this.bulkCreateKey = typeKey;
        this.bulkCreateCount = 0;
        this.bulkCreateTags = [];

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
            options['tags'] = this.bulkCreateTags;

            this.addElement(this.bulkCreateKey, options);
        }

        $('#bulkCreateModal')['modal']('hide');

        return false;
    }

    setBulkCountByFileInput(): void {
        this.bulkCreateCount = document.getElementById('game-create-bulkcreate-' + this.getElementDefinition(this.bulkCreateKey).bulk.key)['files'].length;
    }

    /**
     * PieceContainer Position-Editor
     */
    @ViewChild('templateContainer') templateContainerRef: ElementRef;
    templateFactor = 25;
    templatePadding = 100;
    templatePlayerCount = 10;
    templatePlayerSlotIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    templatePlayerColors = ['#f00','#ff0','#0a0','#00f','#f0f','#f80','#3f0','#0ff','#808','#888'];

    positionEditorActive: boolean = false;
    positionEditorTemplateElementId = null;
    positionEditorTool = null;
    positionEditorPositions = [];
    positionStartJointIndex = null;
    positionArrows = [];

    startPositionEditor(): boolean {
        this.positionEditorActive = true;
        this.positionEditorTemplateElementId = null;
        this.positionEditorPositions = this.elements[this.currentElementIndex].element.positions;
        this.positionArrows = this.getPositionArrows();
        this.positionEditorTool = 'createPoint';

        this.applicationRef.tick();
        $(this.templateContainerRef.nativeElement).on('mousemove', (e) => {
            if (this.positionEditorTool == 'createPoint') {
                $('.positionEditorContainer .point.preview').css({
                    left: e.offsetX - this.elements[this.currentElementIndex].element.stackElementRadius / 2 * this.templateFactor,
                    top: e.offsetY - this.elements[this.currentElementIndex].element.stackElementRadius / 2 * this.templateFactor,
                });
            }
        }).on('mouseleave', () => {
            if (this.positionEditorTool == 'createPoint') {
                $('.positionEditorContainer .point.preview').hide();
            }
        }).on('mouseenter', () => {
            if (this.positionEditorTool == 'createPoint') {
                $('.positionEditorContainer .point.preview').show();
            }
        }).on('click', (e) => {
            if (this.positionEditorTool == 'createPoint') {
                this.positionEditorPositions.push({
                    index: this.positionEditorPositions.length + 1,
                    x: (e.offsetX - this.getWidthOfTemplate() / 2 - this.templatePadding) / this.templateFactor,
                    y: (e.offsetY - this.getHeightOfTemplate() / 2 - this.templatePadding) / this.templateFactor,
                    next: {}
                });
            }
        });

        return false;
    }
    cancelPositionEditor(): boolean {
        this.positionEditorActive = false;

        return false;
    }
    savePositionEditor(): boolean {
        this.elements[this.currentElementIndex].element.positions = this.positionEditorPositions;

        this.positionEditorActive = false;

        return false;
    }
    
    getWidthOfTemplate(): number {
        let originalWidth = 30;
        
        if (this.positionEditorTemplateElementId) {
            switch (this.getElementById(this.positionEditorTemplateElementId).type) {
                case 'board_v1':
                case 'card_v1':
                    originalWidth = this.getElementById(this.positionEditorTemplateElementId).element.width;
                    break;
                case 'tile_v1':
                    originalWidth = this.getElementById(this.positionEditorTemplateElementId).element.radius;
                    break;
            }
        }
        
        return originalWidth * this.templateFactor;
    }
    
    getHeightOfTemplate(): number {
        let originalHeight = 30;
        
        if (this.positionEditorTemplateElementId) {
            switch (this.getElementById(this.positionEditorTemplateElementId).type) {
                case 'board_v1':
                case 'card_v1':
                    originalHeight = this.getElementById(this.positionEditorTemplateElementId).element.height;
                    break;
                case 'tile_v1':
                    originalHeight = this.getElementById(this.positionEditorTemplateElementId).element.radius;
                    break;
            }
        }
        
        return originalHeight * this.templateFactor;
    }

    getImageOfTemplate(): string {
        let image = '';

        if (this.positionEditorTemplateElementId) {
            let element = this.getElementById(this.positionEditorTemplateElementId).element;

            switch (this.getElementById(this.positionEditorTemplateElementId).type) {
                case 'board_v1':
                    if (element.image) {
                        image = element.image.src;
                    }
                    break;
                case 'card_v1':
                case 'tile_v1':
                    if (element.frontImage) {
                        image = element.frontImage.src;
                    }
                    break;
            }
        }

        return image;
    }

    clickPoint(index): void {
        if (this.positionEditorTool == 'deletePoint') {
            for (let i = this.positionArrows.length - 1; i >= 0; i--) {
                if (this.positionArrows[i].from == this.positionEditorPositions[index]) {
                    this.positionArrows.splice(i, 1);
                } else if (this.positionArrows[i].to == this.positionEditorPositions[index]) {
                    for (let slotIndex in this.positionArrows[i].from.next) {
                        if (!this.positionArrows[i].from.next.hasOwnProperty(slotIndex)) continue;
                        if (this.positionArrows[i].allowedSlotIndexes.indexOf(slotIndex) == -1) continue;
                        if (this.positionArrows[i].from.next[slotIndex].indexOf(this.positionArrows[i].to.index) == -1) continue;

                        this.positionArrows[i].from.next[slotIndex].splice(this.positionArrows[i].from.next[slotIndex].indexOf(this.positionArrows[i].to.index), 1);
                    }

                    this.positionArrows.splice(i, 1);
                }
            }

            this.positionEditorPositions.splice(index, 1);
        }
        if (this.positionEditorTool == 'createJoint') {
            if (this.positionStartJointIndex === null) {
                this.positionStartJointIndex = index;
            } else if (this.positionStartJointIndex == index) {
                this.positionStartJointIndex = null;
            } else {
                let allowedSlotIndexes = [];
                for (let i = 0; i < this.templatePlayerCount; i++) {
                    if (!$('#templatePlayerSlotIndex' + i).is(':checked')) continue;

                    allowedSlotIndexes.push(i);

                    if (typeof this.positionEditorPositions[this.positionStartJointIndex].next[i] == 'undefined') {
                        this.positionEditorPositions[this.positionStartJointIndex].next[i] = [];
                    }
                    this.positionEditorPositions[this.positionStartJointIndex].next[i].push(this.positionEditorPositions[index].index);
                }

                if (allowedSlotIndexes.length > 0) {
                    this.positionArrows.push({
                        from: this.positionEditorPositions[this.positionStartJointIndex],
                        to: this.positionEditorPositions[index],
                        allowedSlotIndexes: allowedSlotIndexes
                    });

                    this.positionStartJointIndex = index;
                }
            }
        }
    }

    clickJoint(arrow) {
        if (this.positionEditorTool == 'deleteJoint') {
            for (let slotIndex in arrow.from.next) {
                if (!arrow.from.next.hasOwnProperty(slotIndex)) continue;
                if (arrow.allowedSlotIndexes.indexOf(slotIndex) == -1) continue;
                if (arrow.from.next[slotIndex].indexOf(arrow.to.index) == -1) continue;

                arrow.from.next[slotIndex].splice(arrow.from.next[slotIndex].indexOf(arrow.to.index), 1);
            }

            this.positionArrows.splice(this.positionArrows.indexOf(arrow), 1);
        }
    }

    getPositionArrows(): any {
        let arrows = [];
        for (let sourcePosition of this.positionEditorPositions) {
            let targets = {};
            for (let slotIndex in sourcePosition.next) {
                if (!sourcePosition.next.hasOwnProperty(slotIndex)) continue;

                for (let targetIndex of sourcePosition.next[slotIndex]) {
                    if (typeof targets[targetIndex] == 'undefined') {
                        targets[targetIndex] = [];
                    }
                    targets[targetIndex].push(slotIndex);
                }
            }

            for (let targetIndex in targets) {
                if (!targets.hasOwnProperty(targetIndex)) continue;

                for (let targetPosition of this.positionEditorPositions) {
                    if (targetPosition.index != targetIndex) continue;

                    arrows.push({
                        from: sourcePosition,
                        to: targetPosition,
                        allowedSlotIndexes: targets[targetIndex]
                    });
                }
            }
        }

        return arrows;
    }

    selectAllSlotIndexes() {
        for (let slotIndex of this.templatePlayerSlotIndexes) {
            let elem = $('#templatePlayerSlotIndex' + slotIndex);
            if (!elem.is(':checked')) {
                elem.parent().click();
            }
        }
    }

    deselectAllSlotIndexes() {
        for (let slotIndex of this.templatePlayerSlotIndexes) {
            let elem = $('#templatePlayerSlotIndex' + slotIndex);
            if (elem.is(':checked')) {
                elem.parent().click();
            }
        }
    }

    /**
     * Sequences
     */
    possibleCommands = [
        {key: 'control', label: 'Kontrollstrukturen', commands: [
            {key: 'if', label: 'if/else', title: 'Falls die Bedingung zutrifft, dann (...), ansonsten (...)', defaultOptions: {'if': null}, displayText: (node) => node.command},
            {key: 'for', label: 'for', title: 'Wiederhole (...) x mal', defaultOptions: {'count': 5}, displayText: (node) => node.command},
            {key: 'foreach', label: 'foreach', title: 'Wiederhole (...) für jedes Item aus einer Liste', defaultOptions: {'list': null}, displayText: (node) => node.command},
            {key: 'while', label: 'while', title: 'Wiederhole (...) solange, bis die Bedingung zutrifft', defaultOptions: {'condition': null}, displayText: (node) => node.command}
        ]},
        {key: 'player', label: 'Spielerbefehle', commands: [
            {key: 'points', label: 'points', title: 'Gebe einem Spieler x Punkte oder setze seine Punkte auf x', defaultOptions: {'points': 1, 'mode': 'add'}, displayText: (node) => node.command},
            {key: 'wait', label: 'wait', title: 'Warte auf eine Aktion eines Spielers', defaultOptions: {'action': null}, displayText: (node) => node.command}
        ]},
        {key: 'element', label: 'Elementbefehle', commands: [
            {key: 'move', label: 'move', title: 'Verschiebt ein Element an einen anderen Ort', defaultOptions: {'mode': 'element', 'element': null, 'tag': null, 'loop': null, 'method': null, 'targetmode': 'element', 'targetelement': null, 'targetloop': null, 'targetmethod': null, 'targettype': null, 'targetdata': {}}, displayText: (node) => node.command},
            {key: 'change', label: 'change', title: 'Ändert Attribute eines Elements zur Laufzeit, z.B. Karte umdrehen', defaultOptions: {'mode': 'element', 'element': null, 'tag': null, 'loop': null, 'method': null, 'option': null, 'value': null}, displayText: (node) => node.options.option ? node.options.option + ' -> ' + node.options.value : node.command}
        ]},
        {key: 'match', label: 'Partiebefehle', commands: [
            {key: 'notification', label: 'notification', title: 'Fügt eine Mitteilung in den Chat ein (ggf. nur für einen bestimmten Spieler sichtbar)', defaultOptions: {'text': null}, displayText: (node) => node.options.text || node.command},
            {key: 'status', label: 'status', title: 'Setzt den hervorgehobenen Status auf diesen Text', defaultOptions: {'text': null}, displayText: (node) => node.options.text || node.command},
            {key: 'progress', label: 'progress', title: 'Setzt oder erhöht den Spielfortschritt auf die gegebene Prozentzahl', defaultOptions: {'mode': 'set', 'percent': 0, 'method': null}, displayText: (node) => (node.options.mode == 'add' ? '+ ' : '') + (node.options.method ? this.getMethodById(node.options.method).name + '()' : (node.options.percent + ' %'))},
            {key: 'finish', label: 'finish', title: 'Beendet die Partie an dieser Stelle (Gewinner wird der Spieler mit den meisten Punkten)', defaultOptions: {}, displayText: (node) => node.command}
        ]},
        {key: 'default', label: 'Sonstige Befehle', commands: [
            {key: 'sequence', label: 'sequence', title: 'Ruft eine wiederverwendbare Sequenz auf', defaultOptions: {'sequence': null}, displayText: (node) => node.options.sequence ? this.getSequenceById(node.options.sequence).name : node.command},
            {key: 'method', label: 'method', title: 'Ruft eine wiederverwendbare und zuvor definierte Methode auf', defaultOptions: {'method': null}, displayText: (node) => node.options.method ? this.getMethodById(node.options.method).name + '()' : node.command},
            {key: 'sleep', label: 'sleep', title: 'Warte eine gegebene Zeit, bis mit dem Programmablauf fortgefahren wird', defaultOptions: {'time': 1000}, displayText: (node) => node.command + ' ' + node.options.time + 'ms'},
            {key: 'break', label: 'break', title: 'Verlässt die aktuelle (oder falls gewünscht höhere) Schleife', defaultOptions: {'hirarchy': 1}, displayText: (node) => node.command + (node.options.hirarchy > 1 ? ' ' + node.options.hirarchy : '')}
        ]}
    ];
    nextSequenceId = 5;
    sequences = [
        {id: 1, command: null, name: 'onGameSetup', canHaveChildren: true, children: {'': []}, deletable: false},
        {id: 2, command: null, name: 'onPlayerJoin', canHaveChildren: true, children: {'': []}, deletable: false},
        {id: 3, command: null, name: 'onPlayerLeave', canHaveChildren: true, children: {'': []}, deletable: false},
        {id: 4, command: null, name: 'onGameStart', canHaveChildren: true, children: {'': []}, deletable: false}
    ];
    sequenceCurrentItem = null;

    createSequence(): boolean {
        this.sequences.push({id: this.nextSequenceId, command: null, name: 'unnamedSequence_' + this.nextSequenceId, canHaveChildren: true, children: {'': []}, deletable: true});

        this.selectSequenceItem(this.nextSequenceId);

        this.nextSequenceId++;

        return false;
    }

    selectSequenceItem(id): boolean {
        this.sequenceCurrentItem = id;

        return false;
    }

    getCommandDefinition(command) {
        for (let category of this.possibleCommands) {
            for (let innerCommand of category.commands) {
                if (innerCommand.key == command) {
                    return innerCommand;
                }
            }
        }
        return null;
    }

    getSequenceById(id, sequences = null) {
        if (sequences == null) {
            sequences = this.sequences;
        }

        for (let sequence of sequences) {
            if (sequence.id == id) {
                return sequence;
            }
            if (sequence.canHaveChildren) {
                for (let key in sequence.children) {
                    if (!sequence.children.hasOwnProperty(key)) continue;

                    let result = this.getSequenceById(id, sequence.children[key]);
                    if (result) {
                        return result;
                    }
                }
            }
        }

        return null;
    }

    getSequenceParentOfId(id, parent = null) {
        if (parent == null) {
            parent = {id: 0, canHaveChildren: true, children: {'': this.sequences}};
        }

        for (let key in parent.children) {
            if (!parent.children.hasOwnProperty(key)) continue;

            for (let child of parent.children[key]) {
                if (child.id == id) {
                    return parent;
                }
                if (child.canHaveChildren) {
                    let result = this.getSequenceParentOfId(id, child);
                    if (result) {
                        return result;
                    }
                }
            }
        }

        return null;
    }

    addCommand(id, section, command) {
        if (['for', 'foreach', 'while'].indexOf(command) > -1) {
            this.getSequenceById(id).children[section].push({
                id: this.nextSequenceId,
                command: command,
                name: command + '_' + this.nextSequenceId,
                options: this.getCommandDefinition(command).defaultOptions,
                canHaveChildren: true,
                children: {'': []},
                deletable: true
            });
        } else if (['if'].indexOf(command) > -1) {
            this.getSequenceById(id).children[section].push({
                id: this.nextSequenceId,
                command: command,
                name: command + '_' + this.nextSequenceId,
                options: this.getCommandDefinition(command).defaultOptions,
                canHaveChildren: true,
                children: {
                    'then': [],
                    'else': []
                },
                deletable: true
            });
        } else {
            this.getSequenceById(id).children[section].push({
                id: this.nextSequenceId,
                command: command,
                name: command + '_' + this.nextSequenceId,
                options: this.getCommandDefinition(command).defaultOptions,
                canHaveChildren: false,
                deletable: true
            });
        }

        this.selectSequenceItem(this.nextSequenceId);

        this.nextSequenceId++;

        return false;
    }

    deleteItem(id, sequences = null) {
        if (sequences == null) {
            sequences = this.sequences;
        }

        this.sequenceCurrentItem = null;

        for (let i = 0; i < sequences.length; i++) {
            if (sequences[i].id == id) {
                sequences.splice(i, 1);
            } else if (sequences[i].canHaveChildren) {
                for (let key in sequences[i].children) {
                    if (!sequences[i].children.hasOwnProperty(key)) continue;

                    this.deleteItem(id, sequences[i].children[key]);
                }
            }
        }
    }

    moveItemUp(id) {
        let item = this.getSequenceById(id);
        let parent = this.getSequenceParentOfId(id);

        let previousSection = null;
        for (let key in parent.children) {
            if (!parent.children.hasOwnProperty(key)) continue;

            let index = parent.children[key].indexOf(item);
            if (index == -1) {
                previousSection = key;
                continue;
            }

            //Falls das Item nicht das erste im aktuellen Parent ist
            if (index > 0) {

                //Falls das Item davor ebenfalls Children aufnehmen kann, dort ganz ans Ende in dessen Children aufnehmen
                if (parent.children[key][index - 1].canHaveChildren) {
                    parent.children[key].splice(index, 1);

                    let lastKey = null;
                    for (let innerKey in parent.children[key][index - 1].children) {
                        if (parent.children[key][index - 1].children.hasOwnProperty(innerKey)) {
                            lastKey = innerKey;
                        }
                    }
                    parent.children[key][index - 1].children[lastKey].push(item);
                    return;
                }

                //Ansonsten einfach um 1 nach vorne in den aktuellen Children seines Parents schieben
                parent.children[key].splice(index, 1);
                parent.children[key].splice(index - 1, 0, item);
                return;
            }

            //Ansonsten falls das Parent mehrere Sections hat, und man nicht in der ersten Section ganz oben steht, in die vorherige Section ans Ende schieben
            if (previousSection !== null) {
                parent.children[key].splice(index, 1);
                parent.children[previousSection].push(item);
                return;
            }

            //Ansonsten falls es schon in der äußersten Ebene ganz oben ist, nichts machen
            if (parent.id == 0) {
                return;
            }

            //Ansonsten schiebe es in der Children-Liste des Parents vom Parent eins nach vorne
            let grandParent = this.getSequenceParentOfId(parent.id);
            if (grandParent.id != 0) {
                for (let grandKey in grandParent.children) {
                    if (!grandParent.children.hasOwnProperty(grandKey)) continue;

                    let grandIndex = grandParent.children[grandKey].indexOf(parent);
                    if (grandIndex == -1) continue;

                    parent.children[key].splice(index, 1);
                    grandParent.children[grandKey].splice(grandIndex, 0, item);
                    return;
                }
            }
            //Falls es in der Sequence schon ganz unten ist, und es nicht die letzte Sequence ist, schiebe es in die nächste Sequence an den Anfang.
            if (grandParent.id == 0) {
                let grandIndex = grandParent.children[''].indexOf(parent);
                if (grandIndex > 0) {
                    parent.children[key].splice(index, 1);
                    grandParent.children[''][grandIndex - 1].children[''].push(item);
                }
            }
        }
    }

    moveItemDown(id) {
        let item = this.getSequenceById(id);
        let parent = this.getSequenceParentOfId(id);

        for (let key in parent.children) {
            if (!parent.children.hasOwnProperty(key)) continue;

            let index = parent.children[key].indexOf(item);
            if (index == -1) continue;

            //Falls das Item nicht das letzte im aktuellen Parent ist
            if (index < parent.children[key].length - 1) {

                //Falls das Item danach ebenfalls Children aufnehmen kann, dort ganz ans Anfang in dessen Children aufnehmen
                if (parent.children[key][index + 1].canHaveChildren) {

                    let firstKey = null;
                    for (let innerKey in parent.children[key][index + 1].children) {
                        if (parent.children[key][index + 1].children.hasOwnProperty(innerKey)) {
                            firstKey = innerKey;
                            break;
                        }
                    }
                    parent.children[key].splice(index, 1);
                    parent.children[key][index].children[firstKey].unshift(item);
                    return;
                }

                //Ansonsten einfach um 1 nach hinten in den aktuellen Children seines Parents schieben
                parent.children[key].splice(index, 1);
                parent.children[key].splice(index + 1, 0, item);
                return;
            }

            //Ansonsten falls das Parent mehrere Sections hat, und man nicht in der letzten Section ganz unten steht, in die nächste Section an den Anfang schieben
            let startCompare = false;
            for (let nextSection in parent.children) {
                if (!parent.children.hasOwnProperty(nextSection)) continue;

                if (startCompare) {
                    parent.children[key].splice(index, 1);
                    parent.children[nextSection].unshift(item);
                    return;
                }

                if (nextSection == key) {
                    startCompare = true;
                }
            }

            //Ansonsten falls es schon in der äußersten Ebene ganz unten ist, nichts machen
            if (parent.id == 0) {
                return;
            }

            //Ansonsten schiebe es in der Children-Liste des Parents vom Parent eins nach hinten
            let grandParent = this.getSequenceParentOfId(parent.id);
            if (grandParent.id != 0) {
                for (let grandKey in grandParent.children) {
                    if (!grandParent.children.hasOwnProperty(grandKey)) continue;

                    let grandIndex = grandParent.children[grandKey].indexOf(parent);
                    if (grandIndex == -1) continue;

                    parent.children[key].splice(index, 1);
                    grandParent.children[grandKey].splice(grandIndex + 1, 0, item);
                    return;
                }
            }
            //Falls es in der Sequence schon ganz unten ist, und es nicht die letzte Sequence ist, schiebe es in die nächste Sequence an den Anfang.
            if (grandParent.id == 0) {
                let grandIndex = grandParent.children[''].indexOf(parent);
                if (grandIndex < grandParent.children[''].length - 1) {
                    parent.children[key].splice(index, 1);
                    grandParent.children[''][grandIndex + 1].children[''].unshift(item);
                }
            }
        }
    }

    getCustomSequences() {
        let customSequences = [];

        for (let sequence of this.sequences) {
            if (sequence.deletable && sequence.command === null) {
                customSequences.push(sequence);
            }
        }

        return customSequences;
    }


    /**
     * Methoden
     */
    methods = [];
    currentMethodIndex = null;
    methodOptions = {
        printMargin: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    };

    createMethod() {
        let method = {
            id: this.methods.length + 1,
            name: 'unnamedMethod_' + this.methods.length,
            code: ''
        };

        this.methods.push(method);

        this.selectMethod(this.methods.length - 1);

        return false;
    }

    selectMethod(index) {
        this.currentMethodIndex = index;

        return false;
    }

    getMethodById(id) {
        for (let method of this.methods) {
            if (method.id == id) {
                return method;
            }
        }

        return null;
    }

    getDistinctTags() {
        let tags = [];

        for (let element of this.elements) {
            for (let tag of element.tags) {
                let found = false;
                for (let existingTag of tags) {
                    if (existingTag.value == tag.value) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    tags.push(tag);
                }
            }
        }

        tags.sort();

        return tags;
    }

    getOuterForEachLoops(sequenceItem) {
        let parent = this.getSequenceParentOfId(sequenceItem);
        if (!parent || parent.command === null) {
            return [];
        }

        let loops = this.getOuterForEachLoops(parent.id);

        if (parent.command == 'foreach') {
            loops.unshift(parent);
        }

        return loops;
    }

    getPossibleElementActions() {
        let actions = [];

        for (let elementType of this.elementTypes) {
            for (let changeable of elementType.changeable) {
                actions.push(changeable);
            }
        }

        return actions;
    }
    getElementAction(actionKey) {
        for (let action of this.getPossibleElementActions()) {
            if (action.key == actionKey) {
                return action;
            }
        }

        return null;
    }
    getDefaultTargetOptions(elementType) {
        let elementDefinition = this.getElementDefinition(elementType);
        let defaultTargetOptions = {};

        for (let option of elementDefinition.targetOptions) {
            defaultTargetOptions[option.key] = option.defaultValue;
        }

        return defaultTargetOptions;
    }

    isFunction(value) {
        return typeof value == 'function';
    }
}