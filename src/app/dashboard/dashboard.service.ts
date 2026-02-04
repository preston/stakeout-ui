// Author: Preston Lee

import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BaseService } from '../base/base.service';
import { Dashboard } from '../dashboard/dashboard';

@Injectable()
export class DashboardService extends BaseService {
  static readonly PATH = '/dashboards';

  url(): string {
    return this.backendService.url + DashboardService.PATH;
  }

  index(cache = true, sort = 'priority', order = 'desc') {
    const params = new HttpParams()
      .set('sort', sort)
      .set('order', order);
    return this.http
      .get<Dashboard[]>(this.url(), {
        headers: this.headers(),
        params,
      })
      .pipe(map((res) => res));
  }

  get(id: string) {
    return this.http
      .get<Dashboard>(this.url() + '/' + id, { headers: this.headers() })
      .pipe(map((res) => res));
  }

  create(dashboard: Dashboard) {
    return this.http
      .post<Dashboard>(this.url(), { dashboard }, { headers: this.headers() })
      .pipe(map((res) => res));
  }

  update(dashboard: Dashboard) {
    return this.http
      .put<Dashboard>(this.url() + '/' + dashboard.id, { dashboard }, { headers: this.headers() })
      .pipe(map((res) => res));
  }

  delete(dashboard: Dashboard) {
    return this.http
      .delete<Dashboard>(this.url() + '/' + dashboard.id, {
        headers: this.headers(),
      })
      .pipe(map((res) => res));
  }
}
