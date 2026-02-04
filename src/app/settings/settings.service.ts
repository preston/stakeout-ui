// Author: Preston Lee

import { Injectable, signal, computed } from '@angular/core';
import { Settings, ThemeType } from './settings';

@Injectable()
export class SettingsService {
  static readonly SETTINGS_KEY = 'stakeout_settings';
  static readonly FORCE_RESET_KEY = 'stakeout_settings_force_reset';

  private readonly settingsSignal = signal<Settings>(new Settings());
  readonly settings = this.settingsSignal.asReadonly();

  readonly forceReset = signal(false);
  readonly editable = signal(false);
  readonly screenshots = signal(true);
  readonly displayMode = signal<'wide' | 'overlay'>('overlay');
  readonly theme_effective = signal<ThemeType>(ThemeType.LIGHT);

  constructor() {
    this.reload();
    if (typeof window !== 'undefined' && window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', ({ matches }) => {
          if (this.settings().theme_preferred === ThemeType.AUTOMATIC) {
            this.theme_effective.set(matches ? ThemeType.DARK : ThemeType.LIGHT);
          }
        });
    }
  }

  setEffectiveTheme(): void {
    const preferred = this.settings().theme_preferred;
    if (preferred === ThemeType.AUTOMATIC) {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ) {
        this.theme_effective.set(ThemeType.DARK);
      } else {
        this.theme_effective.set(ThemeType.LIGHT);
      }
    } else {
      this.theme_effective.set(preferred);
    }
  }

  reload(): void {
    this.forceReset.set(
      localStorage.getItem(SettingsService.FORCE_RESET_KEY) === 'true'
    );
    if (this.forceReset()) {
      this.forceResetToDefaults();
      return;
    }
    const tmp = localStorage.getItem(SettingsService.SETTINGS_KEY);
    if (tmp) {
      try {
        const parsed = JSON.parse(tmp);
        if (parsed.theme_preferred == null) {
          parsed.theme_preferred = Settings.DEFAULT_THEME;
        }
        this.settingsSignal.set(parsed);
      } catch (e) {
        console.warn(
          'Settings could not be parsed and are likely not valid JSON. They will be ignored.',
          e
        );
      }
    } else {
      this.settingsSignal.set(new Settings());
    }
    this.setEffectiveTheme();
  }

  forceResetToDefaults(): void {
    localStorage.clear();
    this.settingsSignal.set(new Settings());
    this.forceReset.set(false);
    this.saveSettings();
    this.reload();
    console.log(
      'All application settings have been restored to their defaults.'
    );
  }

  saveSettings(): void {
    localStorage.setItem(
      SettingsService.SETTINGS_KEY,
      JSON.stringify(this.settingsSignal())
    );
    console.log(
      'Your settings have been saved to local browser storage on this device.'
    );
  }

  setEditable(value: boolean): void {
    this.editable.set(value);
  }

  setScreenshots(value: boolean): void {
    this.screenshots.set(value);
  }

  setDisplayMode(mode: 'wide' | 'overlay'): void {
    this.displayMode.set(mode);
  }

  updateSettings(update: Partial<Settings>): void {
    this.settingsSignal.update((s) => ({ ...s, ...update }));
  }
}
