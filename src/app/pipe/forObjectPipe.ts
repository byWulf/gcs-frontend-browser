import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'forObject'})
export class ForObjectPipe implements PipeTransform {
    transform(object, args: string[]): Array<any> {
        let entries = [];
        for (let key in object) {
            if (!object.hasOwnProperty(key)) continue;

            entries.push({key: key, value: object[key]});
        }
        return entries;
    }
}