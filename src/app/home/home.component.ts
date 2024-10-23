// Author: Preston Lee

import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../backend/backend.service";
import { Status } from "../status/status";
import { Dashboard } from "../dashboard/dashboard";
import { DashboardService } from "../dashboard/dashboard.service";
import { v4 as uuidv4 } from 'uuid';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MomentModule } from "ngx-moment";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FormsModule } from "@angular/forms";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { BaseComponent } from "../dashboard/base.component";
import { SettingsService } from "../settings/settings.service";

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, DashboardComponent, MomentModule, RouterOutlet]
})
export class HomeComponent extends BaseComponent implements OnInit {


    public title: string = (window as any)["STAKEOUT_UI_TITLE"];

    sidebarActive: boolean = true;

    status: Status | null = null;

    editing: { [key: string]: boolean } = {};

    public dashboards: Dashboard[] = [];
    public dashboard: Dashboard | null = null;

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
            if (d.length > 0) {
                this.route.navigate(['/dashboards', d[0].id]);
            }
        });
    }

    select(dashboard: Dashboard | null) {
        if (dashboard) {
            this.dashboard = dashboard;
            this.route.navigate(['/dashboards', dashboard.id]);
        } else {
            this.dashboard = null;
            this.route.navigate(['/']);
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
                console.log("Deleted dashboard: " + dashboard.name);
                this.select(null);
                let i = this.dashboards.indexOf(dashboard, 0);
                if (i >= 0) {
                    this.dashboards.splice(i, 1);
                }
            }, error: e => {
                if (!this.checkAccessDenied(e)) {
                    this.toastrService.error(this.dashboardService.formatErrorsText(e.errors), 'Dashboard not deleted.');
                }
            }
        });
    }
}

