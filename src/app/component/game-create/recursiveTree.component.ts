import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
    selector: 'recursiveTree',
    templateUrl: './recursiveTree.component.html',
    styleUrls: [ './recursiveTree.component.css' ]
})
export class RecursiveTreeComponent {
    @Input() nodes;
    @Input() currentNode;
    @Input() possibleCommands;

    @Output() selectItem:EventEmitter<string> = new EventEmitter();
    @Output() addCommand:EventEmitter<any> = new EventEmitter();
    @Output() deleteItem:EventEmitter<string> = new EventEmitter();
    @Output() moveUp:EventEmitter<string> = new EventEmitter();
    @Output() moveDown:EventEmitter<string> = new EventEmitter();

    onSelectItem(id): boolean {
        this.selectItem.emit(id);

        return false;
    }

    onAddCommand(id, section, command): boolean {
        this.addCommand.emit({id: id, section: section, command: command});

        return false;
    }

    onDeleteItem(id): boolean {
        this.deleteItem.emit(id);

        return false;
    }

    onMoveUp(id): boolean {
        this.moveUp.emit(id);

        return false;
    }

    onMoveDown(id): boolean {
        this.moveDown.emit(id);

        return false;
    }

    getCategoryForCommand(command): string {
        for (let category of this.possibleCommands) {
            for (let innerCommand of category.commands) {
                if (innerCommand.key == command) {
                    return category;
                }
            }
        }
        return null;
    }

    getCommandByName(command): string {
        for (let category of this.possibleCommands) {
            for (let innerCommand of category.commands) {
                if (innerCommand.key == command) {
                    return innerCommand;
                }
            }
        }
        return null;
    }
}