// Author: Preston Lee

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { BaseService } from "../base/base.service";

import { BackendService } from '../backend/backend.service';

import { Dashboard } from '../dashboard/dashboard';
import { Service } from "./service";
import { DashboardService } from "../dashboard/dashboard.service";

@Injectable()
export class ServiceService extends BaseService {


    public static PATH: string = '/services';

    constructor(backendService: BackendService, http: HttpClient) {
        super(backendService, http);
    }

    url(dashboard: Dashboard): string {
        return this.backendService.url + DashboardService.PATH + '/' + dashboard.id + ServiceService.PATH;
    }


    index(dashboard: Dashboard, sort: string = 'priority', order: string = 'desc') {
        let params = new HttpParams().set('sort', sort).set('order', order);
        let services = this.http.get<Service[]>(this.url(dashboard), { headers: this.headers(), params: params }).pipe(map(res => res));
        return services;
    }



    create(dashboard: Dashboard, service: Service) {
        let obs = this.http.post<Service>(this.url(dashboard), { 'dashboard_id': dashboard.id, service: service }, { headers: this.headers() }).pipe(map(res => res));
        return obs;
    }


    update(dashboard: Dashboard, service: Service) {
        let obs = this.http.put<Service>(this.url(dashboard) + '/' + service.id, { 'dashboard': dashboard, service: service }, { headers: this.headers() }).pipe(map(res => res));
        return obs;
    }

    delete(dashboard: Dashboard, service: Service) {
        let obs = this.http.delete<Service>(this.url(dashboard) + '/' + service.id, { headers: this.headers() }).pipe(map(res => res));
        return obs;
    }
}