import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackendService } from './backend/backend.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardsComponent } from './dashboard/dashboards.component';
import { ServiceComponent } from './service/service.component';
import { ServiceService } from './service/service.service';
import { ServicesComponent } from './service/services.component';
import { ToasterConfigurationService } from './toaster/toaster.configuration.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardsComponent,
    DashboardComponent,
    ServicesComponent,
    ServiceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
		BrowserAnimationsModule, // For Toaster
        ToastrModule.forRoot(),
        MomentModule,
    AppRoutingModule
  ],
  providers: [
    BackendService,
    ToasterConfigurationService,
    DashboardService,
    ServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
