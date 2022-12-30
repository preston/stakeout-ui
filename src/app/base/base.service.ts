import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { HttpHeaders } from '@angular/common/http';

import { BackendService } from '../backend/backend.service';

@Injectable()
export abstract class BaseService {

  constructor(protected backendService: BackendService, protected http: HttpClient) {
  }

  headers(): HttpHeaders {
    return this.backendService.headers();
  }

}
