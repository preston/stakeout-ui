// Author: Preston Lee

import { Component, OnInit } from "@angular/core";
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
import { ActivatedRoute } from "@angular/router";
import { ServiceComponent } from "../service/service.component";


@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, FormsModule, MomentModule, ServiceComponent]
})
export class DashboardComponent extends BaseComponent implements OnInit {

    id: string | null = null;
    // @Input() dashboard!: Dashboard;
    dashboard: Dashboard = new Dashboard();
    // @Input() dashboards!: Dashboard[];
    services: Service[] = [];
    loading: boolean = true;

    page = '1';
    perPage = '25';
    sort: 'name' | 'ping' | 'updated_at' = 'name';
    order: 'asc' | 'desc' = 'asc';

    editing: { [key: string]: boolean } = {};

    setDisplayMode(mode: 'wide' | 'overlay') {
        this.settingsService.displayMode = mode;
        console.log("Display mode set to " + this.settingsService.displayMode);

    }

    refresh_options = [
        { name: ' Screen Refresh Disabled', value: 0 },
        // { name: '15 Second Refresh', value: 1000 * 15 },
        { name: '1 Minute Refresh', value: 1000 * 60 },
        { name: '15 Minute Refresh', value: 1000 * 60 * 15 },
        { name: '1 Hour Refresh', value: 1000 * 60 * 60 },
    ]

    refresh: number = 0;
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
        this.router.paramMap.subscribe({
            next: (params) => {
                this.id = params.get('id');
                console.log('Loading services for dashboard ' + this.id + '.');
                this.reload();
            }, error: e => {
                this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Could not load dashboard, likely due to a network or server issue.');
            }
        });
    }

    settings() {
        return this.settingsService.settings;
    }


    editable() {
        return this.settingsService.editable;
    }

    ngOnInit() {
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

    sortBy(sort: 'name' | 'ping' | 'updated_at') {
        this.sort = sort;
        this.order = this.order === 'asc' ? 'desc' : 'asc';
        this.reload();
    }

    reload() {
        this.loading = true;
        if (this.id) {
            this.dashboardService.get(this.id).subscribe({
                next: (r) => {
                    this.last_reload = Date.now();
                    console.log("Dashboard " + r.name + ' found. Loading services...');
                    this.dashboard = r;
                    this.serviceService.index(this.dashboard, this.settingsService.screenshots, this.sort, this.order).subscribe((r) => {
                        console.log("Dashboard " + this.dashboard.name + ' services loaded. Screenshots: ' + this.settingsService.screenshots);
                        this.services = r;
                    });
                }, error: e => {
                    this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Could not load dashboard.');
                }, complete: () => {
                    this.loading = false;
                }
            });
        }
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
                this.services.push(r);
                this.editing[r.id] = true;
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Service not created.');
                }
            }
        });
    }


    delete(s: Service) {
        this.serviceService.delete(this.dashboard, s).subscribe({
            next: d => {
                this.toastrService.success("It's service list has also been removed.", 'Service deleted');
                let i = this.services.indexOf(s, 0);
                if (i >= 0) {
                    this.services.splice(i, 1);
                }
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.serviceService.formatErrorsText(e.errors), 'Service not deleted.');
                }
            }
        });
    }
}
