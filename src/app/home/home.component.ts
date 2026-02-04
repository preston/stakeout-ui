// Author: Preston Lee

import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { BackendService } from '../backend/backend.service';
import { Status } from '../status/status';
import { Dashboard } from '../dashboard/dashboard';
import { DashboardService } from '../dashboard/dashboard.service';
import { SettingsService } from '../settings/settings.service';
import { BaseComponent } from '../dashboard/base.component';
import { Router, ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MomentModule,
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends BaseComponent {
  private readonly backendService = inject(BackendService);
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly settingsService = inject(SettingsService);

  readonly title = (window as unknown as { STAKEOUT_UI_TITLE?: string })['STAKEOUT_UI_TITLE'] ?? '';
  readonly sidebarActive = signal(true);
  readonly status = signal<Status | null>(null);
  readonly editing = signal<Record<string, boolean>>({});
  readonly dashboards = signal<Dashboard[]>([]);
  readonly dashboard = signal<Dashboard | null>(null);
  readonly sort = signal<'name'>('name');
  readonly order = signal<'asc' | 'desc'>('asc');

  readonly editable = () => this.settingsService.editable();

  constructor() {
    super();
    this.backendService.status().subscribe((d) => this.status.set(d));
    this.reload();
  }

  lock(): void {
    this.settingsService.setEditable(false);
  }

  sortBy(sort: 'name'): void {
    this.sort.set(sort);
    this.order.update((o) => (o === 'asc' ? 'desc' : 'asc'));
    this.reload();
  }

  reload(): void {
    this.dashboardService
      .index(false, this.sort(), this.order())
      .subscribe((d) => {
        this.dashboards.set(d);
        if (this.router.url === '/' && d.length > 0) {
          this.router.navigate(['/dashboards', d[0].id]);
        }
      });
  }

  select(d: Dashboard | null): void {
    if (d) {
      this.dashboard.set(d);
      this.router.navigate(['/dashboards', d.id]);
    } else {
      this.dashboard.set(null);
      this.router.navigate(['/']);
    }
  }

  toggleSidebar(): void {
    this.sidebarActive.update((v) => !v);
  }

  setEditing(id: string, value: boolean): void {
    this.editing.update((e) => ({ ...e, [id]: value }));
  }

  create(): void {
    const newDashboard = new Dashboard();
    newDashboard.name = 'Dashboard ' + uuidv4().substring(0, 4);
    this.dashboardService.create(newDashboard).subscribe({
      next: (r) => {
        this.toastrService.success(
          'Please update the details accordingly!',
          'Dashboard created.'
        );
        this.dashboards.update((list) => [...list, r]);
        this.select(r);
        this.editing.update((e) => ({ ...e, [r.id]: true }));
      },
      error: (e) => {
        if (!this.checkAccessDenied(e)) {
          this.toastrService.error(
            this.dashboardService.formatErrorsText(e.errors ?? {}),
            'Dashboard not created.'
          );
        }
      },
    });
  }

  update(d: Dashboard): void {
    this.dashboardService.update(d).subscribe({
      next: (updated) => {
        this.toastrService.success('Dashboard updated');
        this.editing.update((e) => ({ ...e, [updated.id]: false }));
        this.dashboards.update((list) =>
          list.map((item) => (item.id === d.id ? updated : item))
        );
        this.select(updated);
      },
      error: (e) => {
        if (!this.checkAccessDenied(e)) {
          this.toastrService.error(
            this.dashboardService.formatErrorsText(e.errors ?? {}),
            'Dashboard not updated.'
          );
        }
      },
    });
  }

  delete(d: Dashboard): void {
    this.dashboardService.delete(d).subscribe({
      next: () => {
        this.toastrService.success(
          "It's service list has also been removed.",
          'Dashboard deleted'
        );
        this.select(null);
        this.dashboards.update((list) => list.filter((x) => x.id !== d.id));
      },
      error: (e) => {
        if (!this.checkAccessDenied(e)) {
          this.toastrService.error(
            this.dashboardService.formatErrorsText(e.errors ?? {}),
            'Dashboard not deleted.'
          );
        }
      },
    });
  }
}
