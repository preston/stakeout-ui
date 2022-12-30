import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../backend/backend.service";
import { Status } from "../status/status";
import { Dashboard } from "./dashboard";
import { DashboardService } from "./dashboard.service";
import { v4 as uuidv4 } from 'uuid';
import { Router } from "@angular/router";

@Component({
    selector: 'dashboards',
    templateUrl: 'dashboards.component.html',
    styleUrls: ['dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {


    public title: string = (window as any)["STAKEOUT_TITLE"];

    sidebarActive: boolean = true;

    status: Status | null = null;

    last_reload: number = 0;

    refresh_options = [
        { name: 'Disabled', value: 0 },
        { name: '5 Seconds', value: 1000 * 5},
        { name: '15 Seconds', value: 1000 * 15 },
        { name: '1 Minute', value: 1000 * 60 },
        { name: '15 Minutes', value: 1000 * 60 * 15 },
        { name: '1 Hour', value: 1000 * 60 * 60 },
    ]
    // refresh: { name: string, value: number | null } = this.refresh_options[0];
    refresh: number = 0;

    editing: { [key: string]: boolean } = {};

    public dashboards: Dashboard[] = [];
    public dashboard_full: Dashboard | null = null;
    constructor(
        private backendService: BackendService,
        private route: Router,
        private dashboardService: DashboardService,
        private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.backendService.status().subscribe(d => {
            this.status = d;
            console.log("Server status: " + JSON.stringify(this.status));

        });
        this.reload();
        setInterval(() => {
            if (this.refresh > 0) {
                if (this.last_reload < Date.now() - (10 * 1000)) {
                    console.log("Polling..");
                    this.reload();
                } else {
                    console.log('Data is still fresh. Skipping poll..');
                }
            } else {
                console.log('Auto-refresh is disabled. Skipping poll.');
                
            }
        }, 1000);
    }


    // moment() {
        // return this.backendService.moment().;
    // }

    reload() {
        this.dashboardService.index().subscribe(d => {
            this.dashboards = d;
            this.last_reload = Date.now();
            console.log("Completed load of dashboard data at " + this.last_reload);
            if (!this.dashboard_full && this.dashboards.length > 0) {
                this.select(this.dashboards[0]);
            } else {
                this.select(this.dashboard_full);
            }
        });
    }

    select(dashboard: Dashboard | null) {
        // this.dashboard_full = null;
        if (dashboard) {
            this.dashboardService.get(dashboard.id).subscribe((r) => {
                console.log("Dashboard " + r.name + ' details loaded.');
                this.dashboard_full = r;
            });
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
        d.name = 'Dashboard ' + uuidv4();
        this.dashboardService.create(d).subscribe(r => {
            this.toastrService.success('Please update the details accordingly!', 'Dashboard created.');
            r.name = '';
            this.dashboards.push(r);
            this.select(r)
            this.editing[r.id] = true;
            this.route.navigate(['dashboards', r.id]);
        });
    }


    update(dashboard: Dashboard) {
        if (dashboard) {
            this.dashboardService.update(dashboard).subscribe(d => {
                this.toastrService.success('Dashboard updated');
                let i = this.dashboards.indexOf(dashboard, 0);
                this.editing[d.id] = false;
                this.dashboards[i] = d;
                this.select(d);
                // this.dashboard_full = d;
            }, e => {
                this.toastrService.error("The dashboard wasn't updated. The server said, " + e, 'Dashboard not updated');
            });
        }
    }

    delete(dashboard: Dashboard) {
        this.dashboardService.delete(dashboard).subscribe(d => {
            this.toastrService.success("It's service list has also been removed.", 'Dashboard deleted');
            let i = this.dashboards.indexOf(dashboard, 0);
            if (i >= 0) {
                this.dashboards.splice(i, 1);
            }
        }, e => {
            this.toastrService.error("The dashboard couldn't be removed. The server said, " + e, 'Dashboard not deleted');
        });
    }
}

