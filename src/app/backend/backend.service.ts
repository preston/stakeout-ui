import { Injectable } from "@angular/core";
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Status } from "../status/status";


@Injectable()
export class BackendService {

	public static STATUS_PATH: string = '/status';

	public url: string;
	public token: string | null = null;

	constructor(protected http: HttpClient) {
		this.url = (window as any)["STAKEOUT_SERVER_URL"];
	}


	public headers(): HttpHeaders {
		var headers = new HttpHeaders({ 'Accept': 'application/json' });
		if (this.token) {
			headers = headers.append('Authorization', 'Bearer ' + this.token);
		}
		return headers;
	}

	statusUrl(): string {
		return this.url + BackendService.STATUS_PATH;
	}

	status() {
		let status = this.http.get<Status>(this.statusUrl(), { headers: this.headers() }).pipe(map(res => res));
		return status;
	}
	
}
