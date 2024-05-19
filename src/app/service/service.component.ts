// Author: Preston Lee

import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Service } from "./service";
import { ServiceService } from "./service.service";
import { CommonModule } from "@angular/common";
import { SettingsService } from "../settings/settings.service";
import { BaseComponent } from "../dashboard/base.component";
import { ToastrService } from "ngx-toastr";
import { Dashboard } from "../dashboard/dashboard";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "ngx-moment";

@Component({
    selector: 'service',
    templateUrl: 'service.component.html',
    styleUrls: ['service.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, MomentModule]
})
export class ServiceComponent extends BaseComponent implements OnInit, OnChanges {

    @Input() dashboard!: Dashboard;
    @Input() service!: Service;

    editing: boolean = false;

    // setDisplayMode(mode: 'wide' | 'overlay') {
    //     this.displayMode = mode;
    // }
    constructor(private serviceService: ServiceService,
        protected settingsService: SettingsService,
        protected override toastrService: ToastrService) {
        super(toastrService);
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.reload();
    }

    ngOnInit() {
        this.reload();
    }

    reload() {

    }

    settings() {
        return this.settingsService.settings;
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

    update(s: Service) {
        // if(this.dashboard){
        this.serviceService.update(this.dashboard, s).subscribe({
            next: d => {
                this.toastrService.success('Service updated');
                let i = this.dashboard.services.indexOf(s, 0);
                this.dashboard.services[i] = d;
                this.editing = false;
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Service not updated.');
                }
            }
        });
        // }
    }
}