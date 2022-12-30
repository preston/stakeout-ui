import { Component, Input, OnInit } from "@angular/core";
import { ToasterConfigurationService } from "../toaster/toaster.configuration.service";
import { Service } from "./service";
import { ServiceService } from "./service.service";

@Component({
    selector: 'service',
    templateUrl: 'service.component.html',
    styleUrls: ['service.component.scss']
})
export class ServiceComponent implements OnInit {

    @Input() service?: Service;

    constructor(private serviceService: ServiceService,
        public toasterConfigurationService: ToasterConfigurationService,
    ) {
    }
    ngOnInit() {
        this.reload();
    }

    reload() {
    }
}