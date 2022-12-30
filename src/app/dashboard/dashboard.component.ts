import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { v4 as uuidv4 } from 'uuid';

import { BackendService } from "../backend/backend.service";
import { Service } from "../service/service";
import { ServiceService } from "../service/service.service";
import { Dashboard } from "./dashboard";
import { DashboardService } from "./dashboard.service";


@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    @Input() dashboard!: Dashboard;
    @Input() dashboards!: Dashboard[];

    editing: { [key: string]: boolean } = {};

    constructor(
        private backendService: BackendService,
        private serviceService: ServiceService, private toastrService: ToastrService) {

    }

    ngOnInit() {
        this.reload();
    }

    reload() {

    }

    moment() {
        return this.backendService.moment();
    }


    create() {
        let s = new Service();
        // s.host
        let tmp = uuidv4();
        s.name = 'Service ' + tmp;
        s.host = tmp;
        this.serviceService.create(this.dashboard, s).subscribe(r => {
            this.toastrService.success('Please configure it!', 'Service created.');
            r.name = '';
            r.host = '';
            this.dashboard.services.push(r);
            // this.select(r)
            this.editing[r.id] = true;
            // this.route.navigate(['dashboards', r.id]);
        });
    }

    update(s: Service) {
        // if(this.dashboard){
        this.serviceService.update(this.dashboard, s).subscribe(d => {
            this.toastrService.success('Service updated');
            let i = this.dashboard.services.indexOf(s, 0);
            this.dashboard.services[i] = d;
            this.editing[d.id] = false;
        }, e => {
            this.toastrService.error("The service wasn't updated. The server said, " + e, 'Dashboard not updated');
        });
    // }
    }

    delete(s: Service) {
        this.serviceService.delete(this.dashboard, s).subscribe(d => {
            this.toastrService.success("It's service list has also been removed.", 'Dashboard deleted');
            let i = this.dashboard.services.indexOf(s, 0);
            if (i >= 0) {
                this.dashboard.services.splice(i, 1);
            }
        }, e => {
            this.toastrService.error("The service couldn't be removed. The server said, " + e, 'Servicie not deleted');
        });
    }
}
