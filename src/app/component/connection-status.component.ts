import {Component, OnInit} from "@angular/core"

import { CommunicationService } from '../service/communication.service';

@Component({
    moduleId: module.id,
    selector: 'connection-status',
    templateUrl: './connection-status.component.html',
    styleUrls: [ './connection-status.component.css' ]
})

export class ConnectionStatusComponent implements OnInit {
    connectionStatus:string = 'connecting';
    wasConnected:boolean = false;

    constructor(private communicationService:CommunicationService) {}

    ngOnInit(): void {
        this.communicationService.connectionSubject.subscribe(status => {
            this.connectionStatus = status;

            let jQuery:any = $;
            if (this.connectionStatus == 'connect') {
                this.wasConnected = true;
                jQuery('#connectionModal').modal('hide');
            } else {
                jQuery('#connectionModal').modal('show');
            }
        });
    }

    ngAfterViewInit(): void {
    }
}