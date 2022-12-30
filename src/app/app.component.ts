import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToasterConfigurationService } from './toaster/toaster.configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(protected http: HttpClient, private toasterConfigurationService: ToasterConfigurationService) {
		console.log("AppComponent has been initialized to establish router element.");
  }
}
