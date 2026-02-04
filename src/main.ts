// Author: Preston Lee

import { provideZonelessChangeDetection } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { ServiceService } from './app/service/service.service';
import { DashboardService } from './app/dashboard/dashboard.service';
import { BackendService } from './app/backend/backend.service';
import { SettingsService } from './app/settings/settings.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(
      FormsModule,
      ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
      MomentModule
    ),
    BackendService,
    DashboardService,
    ServiceService,
    SettingsService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
