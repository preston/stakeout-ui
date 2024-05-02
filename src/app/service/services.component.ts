// Author: Preston Lee

import { Component, OnInit } from "@angular/core";
import { ToasterConfigurationService } from "../toaster/toaster.configuration.service";
import { Service } from "./service";
import { ServiceService } from "./service.service";

@Component({
    selector: 'services',
    templateUrl: 'services.component.html',
    styleUrls: ['services.component.scss'],
    standalone: true,
})
export class ServicesComponent implements OnInit {

    public services: Service[] = [];
    constructor(private serviceService: ServiceService,
		public toasterConfigurationService: ToasterConfigurationService,
) {
	}
	ngOnInit() {
		this.reload();
	}

    reload() {
		// this.serviceService.index().subscribe(d => {
		// 	this.services = d;
		// });
		// this.backendService.status().subscribe(d => {
		// 	this.status = d;
		// });
	}
}