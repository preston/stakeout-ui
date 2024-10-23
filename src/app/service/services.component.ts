// Author: Preston Lee

import { Component, OnInit } from "@angular/core";
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
    constructor(private serviceService: ServiceService
) {
	}
	ngOnInit() {
		this.reload();
	}

    reload() {
	}
}