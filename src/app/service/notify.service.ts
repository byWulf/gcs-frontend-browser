import { Injectable } from '@angular/core';

@Injectable()
export class NotifyService {
    notify(type: string, message: string): void {
        $['notify']({
            // options
            message: message
        },{
            // settings
            type: type,
            placement: {
                from: 'top',
                align: 'center'
            },
            offset: {
                x: 0,
                y: 100
            }
        });
    }
}