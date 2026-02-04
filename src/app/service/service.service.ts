// Author: Preston Lee

import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BaseService } from '../base/base.service';
import { Dashboard } from '../dashboard/dashboard';
import { Service } from './service';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable()
export class ServiceService extends BaseService {
  static readonly PATH = '/services';

  url(dashboard: Dashboard): string {
    return (
      this.backendService.url +
      DashboardService.PATH +
      '/' +
      dashboard.id +
      ServiceService.PATH
    );
  }

  index(
    dashboard: Dashboard,
    screenshots: boolean,
    sort = 'name',
    order = 'desc'
  ) {
    const params = new HttpParams()
      .set('sort', sort)
      .set('order', order)
      .set('screenshots', screenshots);
    return this.http
      .get<Service[]>(this.url(dashboard), {
        headers: this.headers(),
        params,
      })
      .pipe(map((res) => res));
  }

  create(dashboard: Dashboard, service: Service) {
    return this.http
      .post<Service>(
        this.url(dashboard),
        { dashboard_id: dashboard.id, service },
        { headers: this.headers() }
      )
      .pipe(map((res) => res));
  }

  update(dashboard: Dashboard, service: Service) {
    return this.http
      .put<Service>(
        this.url(dashboard) + '/' + service.id,
        { dashboard, service },
        { headers: this.headers() }
      )
      .pipe(map((res) => res));
  }

  delete(dashboard: Dashboard, service: Service) {
    return this.http
      .delete<Service>(this.url(dashboard) + '/' + service.id, {
        headers: this.headers(),
      })
      .pipe(map((res) => res));
  }
}
