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
import { ActivatedRoute, Router } from "@angular/router";


@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, FormsModule, MomentModule]
})
export class DashboardComponent extends BaseComponent implements OnInit {

    id: string | null = null;
    // @Input() dashboard!: Dashboard;
    dashboard: Dashboard = new Dashboard();
    // @Input() dashboards!: Dashboard[];

    editing: { [key: string]: boolean } = {};

    page = '1';
    perPage = '25';
    sort: 'name' | 'ping' = 'name';
    order: 'asc' | 'desc' = 'asc';


    refresh_options = [
        { name: ' Refresh Disabled', value: 0 },
        // { name: '15 Second Refresh', value: 1000 * 15 },
        { name: '1 Minute Refresh', value: 1000 * 60 },
        { name: '15 Minute Refresh', value: 1000 * 60 * 15 },
        { name: '1 Hour Refresh', value: 1000 * 60 * 60 },
    ]

    public refresh: number = 0;
    last_reload: number = 0;

    constructor(
        private backendService: BackendService, protected dashboardService: DashboardService,
        private serviceService: ServiceService, protected override toastrService: ToastrService, protected router: ActivatedRoute,
        protected settingsService: SettingsService) {
        super(toastrService);

        if (this.settingsService.settings.developer) {
            this.refresh_options.unshift(
                { name: "5 Second Refresh (Developers Only)", value: 1000 * 5 });
        }

        // this.id = this.router.snapshot.paramMap.get('id')!;
        this.router.paramMap.subscribe((params) => {
            this.id = params.get('id');
            console.log('Loading services for dashboard ' + this.id + '.');            
            this.reload();
        });
    }

    settings() {
        return this.settingsService.settings;
    }



    ngOnInit() {
        // this.reload();
        setInterval(() => {
            if (this.refresh > 0) {
                if (this.last_reload < Date.now() - this.refresh) {
                    console.log("Polling.. (every " + this.refresh + "ms)");
                    if (this.settingsService.editable) {
                        console.log('Auto-refresh is disabled due to edit mode. Skipping poll.');
                    } else {
                        this.reload();
                    }
                } else {
                    // console.log('Data is still fresh. Skipping poll..');
                }
            } else {
                console.log('Auto-refresh is disabled by user setting. Skipping poll.');

            }
        }, 1000);
    }

    sortBy(sort: 'name' | 'ping') {
        this.sort = sort;
        this.order = this.order === 'asc' ? 'desc' : 'asc';
        this.reload();
    }

    reload() {
        if (this.id) {
            this.dashboardService.get(this.id).subscribe((r) => {
                this.last_reload = Date.now();
                console.log("Dashboard " + r.name + ' details loaded.');
                // this.dashboard_full = r;
                this.dashboard = r;
                this.serviceService.index(this.dashboard, this.sort, this.order).subscribe((r) => {
                    // console.log("Dashboard " + r.name + ' details loaded.');
                    // this.dashboard_full = r;
                    this.dashboard.services = r;
                });
            });
        }
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
