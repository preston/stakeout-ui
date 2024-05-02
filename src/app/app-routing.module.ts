import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './service/services.component';
import { ServiceComponent } from './service/service.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {path: 'dashboards/:id', component: DashboardComponent},
      // {path: 'dashboards/:id/services/:service_id', component: ServiceComponent}
    ]
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
