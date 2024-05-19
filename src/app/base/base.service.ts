// Author: Preston Lee

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';

import { BackendService } from '../backend/backend.service';

@Injectable()
export abstract class BaseService {

  constructor(protected backendService: BackendService, protected http: HttpClient) {
  }

  headers(): HttpHeaders {
    return this.backendService.headers();
  }


  formatErrors(errors: { [field: string]: Array<string> }): string[] {
    let formatted: string[] = [];
    for (let [key, msgs] of Object.entries(errors)) {
      for (let i = 0; i < msgs.length; i++) {
        // const element = array[i];
        formatted.push(key + ' ' + msgs[i]);        
      }
      // msgs.forEach(msg => {
      //   formatted.push(key + ' ' + msg);
      // });
    }
    return formatted;
  }

  formatErrorsHtml(errors: { [field: string]: Array<string> }): string {
    let html = '<ul>';
    for (let e of this.formatErrors(errors)) {
      html += '<li>' + e + '</li>';
    }
    html += '</ul>'
    return html;
  }

  formatErrorsText(errors: { [field: string]: Array<string> }): string {
    let text = this.formatErrors(errors).join(', ');
    return text;
  }

}
