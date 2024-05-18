// Author: Preston Lee

import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '../backend/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(protected toastrService: ToastrService,
    protected settingsService: SettingsService,
    protected backendService: BackendService,
    public location: Location,
    protected router: Router,
  ) {
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.settingsService.reload();
  }

  editable() {
    return this.settingsService.editable;
  }

  unlock() {
    this.backendService.test().subscribe({
      next: res => {
        this.toastrService.success("Auto-refresh will be disabled while in edit mode.", "Authentication Successful");
        this.settingsService.editable = true;
        this.router.navigate(['/']);
      }, error: err => {
        this.toastrService.error("Failed to authenticate. Check username, password, and Internet connection.", "Test Failed");
      }
    });

  }

  lock() {
    this.settingsService.editable = false;
  }

  save() {
    this.settingsService.saveSettings();
    this.toastrService.success("Settings are local to your browser only.", "Settings Saved");
    this.back();
  }

  restore() {
    this.settingsService.forceResetToDefaults();
    this.toastrService.success("All settings have been restored to their defaults.", "Settings Restored");
  }

  back() {
    this.location.back();
  }

}
