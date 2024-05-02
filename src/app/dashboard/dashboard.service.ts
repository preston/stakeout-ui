// Author: Preston Lee

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { BaseService } from "../base/base.service";

import { BackendService } from '../backend/backend.service';

import { Dashboard } from '../dashboard/dashboard';
import { Observable } from "rxjs";

@Injectable()
export class DashboardService extends BaseService {

    public static PATH: string = '/dashboards';

    // public dashboards: Dashboard[] | null = null;

    constructor(backendService: BackendService, http: HttpClient) {
        super(backendService, http);
    }

    url(): string {
        return this.backendService.url + DashboardService.PATH;
    }

    index(cache: boolean = true, sort: string = 'priority', order: string = 'desc') {
        // let dashboards = (this.dashboards);
        // if (dashboards && !cache) {
            let dashboards = this.http.get<Dashboard[]>(this.url(), { headers: this.headers() }).pipe(map(res => res));
        // } else {

        // }
        return dashboards;
    }

    get(id: string) {
        let platform = this.http.get<Dashboard>(this.url() + '/' + id, { headers: this.headers() }).pipe(map(res => res));
        return platform;
    }


    create(dashboard: Dashboard) {
        let obs = this.http.post<Dashboard>(this.url(), { 'dashboard': dashboard }, { headers: this.headers() }).pipe(map(res => res));
        return obs;
    }

    update(dashboard: Dashboard) {
        let obs = this.http.put<Dashboard>(this.url() + '/' + dashboard.id, { 'dashboard': dashboard }, { headers: this.headers() }).pipe(map(res => res));
        return obs;
    }

    delete(dashboard: Dashboard) {
        let obs = this.http.delete<Dashboard>(this.url() + '/' + dashboard.id, { headers: this.headers() }).pipe(map(res => res));
        return obs;
    }
}
