// Author: Preston Lee

import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '../backend/backend.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(protected toastrService: ToastrService, protected settingsService: SettingsService, protected backendService: BackendService, public location: Location) {
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
        this.toastrService.success("Authenticated connection was successful.", "Test Successful");
        this.settingsService.editable = true;
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
  }

  restore() {
    this.settingsService.forceResetToDefaults();
    this.toastrService.success("All settings have been restored to their defaults.", "Settings Restored");
  }

  back() {
    this.location.back();
  }

}
