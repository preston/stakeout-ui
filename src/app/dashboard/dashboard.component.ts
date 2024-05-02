import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { v4 as uuidv4 } from 'uuid';

import { BackendService } from "../backend/backend.service";
import { Service } from "../service/service";
import { ServiceService } from "../service/service.service";
import { Dashboard } from "./dashboard";
import { DashboardService } from "./dashboard.service";
import { MomentModule } from "ngx-moment";
import { FormsModule } from "@angular/forms";
import { NgIf, NgFor } from "@angular/common";
import { BaseComponent } from "./base.component";
import { SettingsService } from "../settings/settings.service";


@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, FormsModule, MomentModule]
})
export class DashboardComponent extends BaseComponent implements OnInit {


    @Input() dashboard!: Dashboard;
    @Input() dashboards!: Dashboard[];

    editing: { [key: string]: boolean } = {};

    constructor(
        private backendService: BackendService,
        private serviceService: ServiceService, protected override toastrService: ToastrService, protected settingsService: SettingsService) {
        super(toastrService);
    }

    ngOnInit() {
        this.reload();
    }

    reload() {

    }

    editable() {
        return this.settingsService.editable;
      }

    statusLevel(s: Service): string {
        let status = 'unknown';
        if (s.checked_at) {
            if ((!s.http || s.http_path_last) && (!s.https || s.https_path_last) && this.pingGood(s)) {
                status = 'good';
            } else {
                status = 'bad';
            }
        }
        return status;
    }

    pingGood(s: Service) {
        return !s.ping || s.ping_last > 0 && s.ping_last < s.ping_threshold;
    }

    create() {
        let s = new Service();
        // s.host
        let tmp = uuidv4().substring(0, 4);
        s.name = 'Service ' + tmp;
        s.host = 'example.com';
        this.serviceService.create(this.dashboard, s).subscribe({
            next: r => {
                this.toastrService.success('Please configure it!', 'Service created.');
                this.dashboard.services.push(r);
                // this.select(r)
                this.editing[r.id] = true;
                // this.route.navigate(['dashboards', r.id]);
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Service not created.');
                }
            }
        });
    }

    update(s: Service) {
        // if(this.dashboard){
        this.serviceService.update(this.dashboard, s).subscribe({
            next: d => {
                this.toastrService.success('Service updated');
                let i = this.dashboard.services.indexOf(s, 0);
                this.dashboard.services[i] = d;
                this.editing[d.id] = false;
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Service not updated.');
                }
            }
        });
        // }
    }

    delete(s: Service) {
        this.serviceService.delete(this.dashboard, s).subscribe({
            next: d => {
                this.toastrService.success("It's service list has also been removed.", 'Service deleted');
                let i = this.dashboard.services.indexOf(s, 0);
                if (i >= 0) {
                    this.dashboard.services.splice(i, 1);
                }
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Service not deleted.');
                }
            }
        });
    }
}
