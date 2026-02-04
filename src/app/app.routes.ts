import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [{ path: 'dashboards/:id', component: DashboardComponent }],
  },
  { path: 'settings', component: SettingsComponent },
];
