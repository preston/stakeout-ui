// Author: Preston Lee

import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../backend/backend.service";
import { Status } from "../status/status";
import { Dashboard } from "../dashboard/dashboard";
import { DashboardService } from "../dashboard/dashboard.service";
import { v4 as uuidv4 } from 'uuid';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { MomentModule } from "ngx-moment";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FormsModule } from "@angular/forms";
import { NgFor, NgIf } from "@angular/common";
import { BaseComponent } from "../dashboard/base.component";
import { SettingsService } from "../settings/settings.service";

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink, NgIf, FormsModule, DashboardComponent, MomentModule, RouterOutlet]
})
export class HomeComponent extends BaseComponent implements OnInit {


    public title: string = (window as any)["STAKEOUT_TITLE"];

    sidebarActive: boolean = true;

    status: Status | null = null;

    editing: { [key: string]: boolean } = {};

    public dashboards: Dashboard[] = [];
    public dashboard_full: Dashboard | null = null;

    page = '1';
    perPage = '25';
    sort: 'name' = 'name';
    order: 'asc' | 'desc' = 'asc';

    constructor(
        protected backendService: BackendService,
        protected dashboardService: DashboardService,
        protected override toastrService: ToastrService,
        protected route: Router,
        protected settingsService: SettingsService) {
        super(toastrService);


    }

    ngOnInit() {
        this.backendService.status().subscribe(d => {
            this.status = d;
            console.log("Server status: " + JSON.stringify(this.status));
        });
        this.reload();

    }


    lock() {
        this.settingsService.editable = false;
    }

    editable() {
        return this.settingsService.editable;
    }

    // moment() {
    // return this.backendService.moment().;
    // }


    sortBy(sort: 'name') {
        this.sort = sort;
        this.order = this.order === 'asc' ? 'desc' : 'asc';
        this.reload();
    }

    reload() {
        this.dashboardService.index(false, this.sort, this.order).subscribe(d => {
            this.dashboards = d;
            // this.last_reload = Date.now();
            // console.log("Completed load of dashboard data at " + this.last_reload);
            // if (!this.dashboard_full && this.dashboards.length > 0) {
            //     this.select(this.dashboards[0]);
            // } else {
            //     this.select(this.dashboard_full);
            // }
        });
    }

    select(dashboard: Dashboard | null) {
        // this.dashboard_full = null;
        if (dashboard) {
            this.dashboard_full = dashboard;
            this.route.navigate(['dashboards', dashboard.id]);
            // this.dashboardService.get(dashboard.id).subscribe((r) => {
            //     console.log("Dashboard " + r.name + ' details loaded.');
            // });
        } else {
            this.dashboard_full = null;
        }
    }


    toggleSidebar() {
        this.sidebarActive = !this.sidebarActive;
        console.log("Toggled sidebar to " + this.sidebarActive);
    }

    create() {
        let d = new Dashboard();
        d.name = 'Dashboard ' + uuidv4().substring(0, 4);
        this.dashboardService.create(d).subscribe({
            next: r => {
                this.toastrService.success('Please update the details accordingly!', 'Dashboard created.');
                this.dashboards.push(r);
                this.select(r)
                this.editing[r.id] = true;
                // this.route.navigate(['dashboards', r.id]);
                this.select(r);
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.dashboardService.formatErrorsText(e.errors), 'Dashboard not created.');
                }
            }
        });
    }

    update(dashboard: Dashboard) {
        if (dashboard) {
            this.dashboardService.update(dashboard).subscribe({
                next: d => {
                    this.toastrService.success('Dashboard updated');
                    let i = this.dashboards.indexOf(dashboard, 0);
                    this.editing[d.id] = false;
                    this.dashboards[i] = d;
                    this.select(d);
                    // this.dashboard_full = d;
                }, error: e => {
                    if (!this.checkAccessDenied(e)) {
                        this.toastrService.error(this.dashboardService.formatErrorsText(e.errors), 'Dashboard not updated.');
                    }
                }
            });
        }
    }

    delete(dashboard: Dashboard) {
        this.dashboardService.delete(dashboard).subscribe({
            next: d => {
                this.toastrService.success("It's service list has also been removed.", 'Dashboard deleted');
                let i = this.dashboards.indexOf(dashboard, 0);
                if (i >= 0) {
                    this.dashboards.splice(i, 1);
                }
                if (this.dashboard_full && this.dashboard_full.id == dashboard.id) {
                    this.select(null);
                }
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.dashboardService.formatErrorsText(e.errors), 'Dashboard not deleted.');
                }
            }
        });
    }
}

