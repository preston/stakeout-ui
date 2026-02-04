// Author: Preston Lee

import {
  Component,
  inject,
  signal,
  computed,
  effect,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { BackendService } from '../backend/backend.service';
import { Service } from '../service/service';
import { ServiceService } from '../service/service.service';
import { Dashboard } from './dashboard';
import { DashboardService } from './dashboard.service';
import { BaseComponent } from './base.component';
import { SettingsService } from '../settings/settings.service';
import { MomentModule } from 'ngx-moment';
import { FormsModule } from '@angular/forms';
import { ServiceComponent } from '../service/service.component';

const REFRESH_OPTIONS = [
  { name: ' Screen Refresh Disabled', value: 0 },
  { name: '1 Minute Refresh', value: 1000 * 60 },
  { name: '15 Minute Refresh', value: 1000 * 60 * 15 },
  { name: '1 Hour Refresh', value: 1000 * 60 * 60 },
];

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [FormsModule, MomentModule, ServiceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends BaseComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly serviceService = inject(ServiceService);
  private readonly route = inject(ActivatedRoute);
  protected readonly settingsService = inject(SettingsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = signal<string | null>(null);
  readonly dashboard = signal<Dashboard>(new Dashboard());
  readonly services = signal<Service[]>([]);
  readonly loading = signal(true);
  readonly sort = signal<'name' | 'updated_at'>('name');
  readonly order = signal<'asc' | 'desc'>('asc');
  readonly editing = signal<Record<string, boolean>>({});
  readonly refresh = signal(REFRESH_OPTIONS[1].value);
  readonly lastReload = signal(0);

  readonly refreshOptions = computed(() => {
    const opts = [...REFRESH_OPTIONS];
    if (this.settingsService.settings().developer) {
      opts.unshift({
        name: '5 Second Refresh (Developers Only)',
        value: 1000 * 5,
      });
    }
    return opts;
  });

  readonly editable = () => this.settingsService.editable();

  private routeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null as string | null }
  );

  constructor() {
    super();
    effect(() => {
      const id = this.routeId();
      if (id != null) {
        this.id.set(id);
        this.reload();
      }
    });

    const interval = setInterval(() => this.reloadIfNeeded(), 1000);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  setDisplayMode(mode: 'wide' | 'overlay'): void {
    this.settingsService.setDisplayMode(mode);
  }

  sortBy(sort: 'name' | 'updated_at'): void {
    this.sort.set(sort);
    this.order.update((o) => (o === 'asc' ? 'desc' : 'asc'));
    this.reload();
  }

  reloadIfNeeded(): void {
    if (this.refresh() <= 0) return;
    if (this.lastReload() >= Date.now() - this.refresh()) return;
    if (this.settingsService.editable()) return;
    this.reload();
  }

  reload(): void {
    const id = this.id();
    if (!id) return;
    this.loading.set(true);
    const destroyRef = this.destroyRef;
    this.dashboardService
      .get(id)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (r) => {
          this.lastReload.set(Date.now());
          this.dashboard.set(r);
          this.serviceService
            .index(
              r,
              this.settingsService.screenshots(),
              this.sort(),
              this.order()
            )
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe({
              next: (list) => this.services.set(list),
              error: (e) => {
                this.toastrService.error(
                  this.serviceService.formatErrorsText(e.errors ?? {}),
                  'Could not load services.'
                );
              },
            });
        },
        error: (e) => {
          this.toastrService.error(
            this.serviceService.formatErrorsText(e.errors ?? {}),
            'Could not load dashboard.'
          );
        },
        complete: () => this.loading.set(false),
      });
  }

  create(): void {
    const d = this.dashboard();
    const s = new Service();
    s.name = 'Service ' + uuidv4().substring(0, 4);
    s.host = 'example.com';
    this.serviceService
      .create(d, s)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.toastrService.success('Please configure it!', 'Service created.');
          this.services.update((list) => [...list, r]);
          this.editing.update((e) => ({ ...e, [r.id]: true }));
        },
        error: (e) => {
          if (!this.checkAccessDenied(e)) {
            this.toastrService.error(
              this.serviceService.formatErrorsText(e.errors ?? {}),
              'Service not created.'
            );
          }
        },
      });
  }

  onServiceUpdated(updated: Service): void {
    this.services.update((list) =>
      list.map((x) => (x.id === updated.id ? updated : x))
    );
  }

  delete(s: Service): void {
    const d = this.dashboard();
    this.serviceService
      .delete(d, s)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastrService.success(
            "It's service list has also been removed.",
            'Service deleted'
          );
          this.services.update((list) => list.filter((x) => x.id !== s.id));
        },
        error: (e) => {
          if (!this.checkAccessDenied(e)) {
            this.toastrService.error(
              this.serviceService.formatErrorsText(e.errors ?? {}),
              'Service not deleted.'
            );
          }
        },
      });
  }
}
