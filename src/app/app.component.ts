// Author: Preston Lee

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {

  constructor(protected http: HttpClient) {
		console.log("AppComponent has been initialized to establish router element.");
  }
}
