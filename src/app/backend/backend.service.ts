// Author: Preston Lee

import { Injectable } from "@angular/core";
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Status } from "../status/status";
import { SettingsService } from "../settings/settings.service";
import { Buffer } from 'buffer';

@Injectable()
export class BackendService {

	public static STATUS_PATH: string = '/status';
	public static TEST_PATH: string = '/test';

	public url: string;
	// public token: string | null = null;

	constructor(protected http: HttpClient, protected settingsService: SettingsService) {
		this.url = (window as any)["STAKEOUT_SERVER_URL"];
	}


	public headers(): HttpHeaders {
		var headers = new HttpHeaders({ 'Accept': 'application/json' });
		headers = headers.set('Content-Type', 'application/json');
		const b64token = Buffer.from(this.settingsService.settings.cds_username + ':' + this.settingsService.settings.cds_password, 'binary').toString('base64');
		headers = headers.set('Authorization', 'Basic ' + b64token);
		// if (this.token) {
		// 	headers = headers.append('Authorization', 'Bearer ' + this.token);
		// }
		return headers;
	}

	statusUrl(): string {
		return this.url + BackendService.STATUS_PATH;
	}

	testUrl(): string {
		return this.url + BackendService.TEST_PATH;
	}

	status() {
		let status = this.http.get<Status>(this.statusUrl(), { headers: this.headers() }).pipe(map(res => res));
		return status;
	}

	test() {
		let test = this.http.post<Status>(this.testUrl(), {}, { headers: this.headers() }).pipe(map(res => res));
		return test;
	}

}
