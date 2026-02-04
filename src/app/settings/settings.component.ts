// Author: Preston Lee

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from './settings.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '../backend/backend.service';
import { ThemeType } from './settings';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  protected readonly toastrService = inject(ToastrService);
  protected readonly settingsService = inject(SettingsService);
  protected readonly backendService = inject(BackendService);
  protected readonly location = inject(Location);
  protected readonly router = inject(Router);

  get username(): string {
    return this.settingsService.settings().cds_username;
  }
  set username(v: string) {
    this.settingsService.updateSettings({ cds_username: v });
  }
  get password(): string {
    return this.settingsService.settings().cds_password;
  }
  set password(v: string) {
    this.settingsService.updateSettings({ cds_password: v });
  }
  get experimental(): boolean {
    return this.settingsService.settings().experimental;
  }
  set experimental(v: boolean) {
    this.settingsService.updateSettings({ experimental: v });
  }
  get developer(): boolean {
    return this.settingsService.settings().developer;
  }
  set developer(v: boolean) {
    this.settingsService.updateSettings({ developer: v });
  }

  themeTypes(): typeof ThemeType {
    return ThemeType;
  }

  themePreferenceChanged(value: ThemeType): void {
    this.settingsService.updateSettings({ theme_preferred: value });
    this.settingsService.setEffectiveTheme();
    this.settingsService.saveSettings();
  }

  reload(): void {
    this.settingsService.reload();
  }

  editable(): boolean {
    return this.settingsService.editable();
  }

  unlock(): void {
    this.backendService.test().subscribe({
      next: () => {
        this.toastrService.success(
          'Auto-refresh will be disabled while in edit mode.',
          'Authentication Successful'
        );
        this.settingsService.setEditable(true);
        this.router.navigate(['/']);
      },
      error: () => {
        this.toastrService.error(
          'Failed to authenticate. Check username, password, and Internet connection.',
          'Test Failed'
        );
      },
    });
  }

  lock(): void {
    this.settingsService.setEditable(false);
  }

  save(): void {
    this.settingsService.saveSettings();
    this.toastrService.success(
      'Settings are local to your browser only.',
      'Settings Saved'
    );
    this.back();
  }

  restore(): void {
    this.settingsService.forceResetToDefaults();
    this.toastrService.success(
      'All settings have been restored to their defaults.',
      'Settings Restored'
    );
  }

  back(): void {
    this.location.back();
  }
}
