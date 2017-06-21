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
            ]
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
            onShow: (element) => { this.visualization.handleGameEvent('button.permissionChanged', {id: element.id, canBeClicked: true}) },
            onHide: (element) => { this.visualization.handleGameEvent('button.permissionChanged', {id: element.id, canBeClicked: false}) }
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
            }
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
            }
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
            }
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
            id: definition.idPrefix + '_' + count,
            type: typeKey,
            parent: {
                id: 'packageContainer'
            },
            element: {}
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

    updateAttribute(key, value): boolean {
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
            if (!$('#templatePlayerSlotIndex' + slotIndex).is(':checked')) {
                $('#templatePlayerSlotIndex' + slotIndex).parent().click();
            }
        }
    }

    deselectAllSlotIndexes() {
        for (let slotIndex of this.templatePlayerSlotIndexes) {
            if ($('#templatePlayerSlotIndex' + slotIndex).is(':checked')) {
                $('#templatePlayerSlotIndex' + slotIndex).parent().click();
            }
        }
    }
}