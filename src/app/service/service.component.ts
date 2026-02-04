// Author: Preston Lee

import {
  Component,
  input,
  output,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Service } from './service';
import { ServiceService } from './service.service';
import { SettingsService } from '../settings/settings.service';
import { BaseComponent } from '../dashboard/base.component';
import { Dashboard } from '../dashboard/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, MomentModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceComponent extends BaseComponent {
  dashboard = input.required<Dashboard>();
  service = input.required<Service>();
  serviceUpdated = output<Service>();

  private readonly serviceService = inject(ServiceService);
  protected readonly settingsService = inject(SettingsService);

  readonly editing = signal(false);

  readonly settings = () => this.settingsService.settings();
  readonly editable = () => this.settingsService.editable();

  constructor() {
    super();
    effect(() => {
      this.service();
      this.dashboard();
      this.reload();
    });
  }

  reload(): void {}

  statusLevel(s: Service): string {
    let status = 'unknown';
    if (s.checked_at) {
      if (
        (!s.http || s.http_path_last) &&
        (!s.https || s.https_path_last)
      ) {
        status = 'good';
      } else {
        status = 'bad';
      }
    }
    return status;
  }

  update(s: Service): void {
    const d = this.dashboard();
    this.serviceService.update(d, s).subscribe({
      next: (updated) => {
        this.toastrService.success('Service updated');
        this.editing.set(false);
        this.serviceUpdated.emit(updated);
      },
      error: (e) => {
        if (!this.checkAccessDenied(e)) {
          this.toastrService.error(
            this.serviceService.formatErrorsText(e.errors ?? {}),
            'Service not updated.'
          );
        }
      },
    });
  }
}
