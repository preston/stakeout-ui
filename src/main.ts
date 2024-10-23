// Author: Preston Lee

import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ServiceService } from './app/service/service.service';
import { DashboardService } from './app/dashboard/dashboard.service';
import { BackendService } from './app/backend/backend.service';
import { SettingsService } from './app/settings/settings.service';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, // For Toaster
            ToastrModule.forRoot({positionClass: 'toast-bottom-right'}), MomentModule, AppRoutingModule),
        BackendService,
        DashboardService,
        ServiceService,
        SettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
    .catch(err => console.error(err));
