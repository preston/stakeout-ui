// Author: Preston Lee

import { Component, Injectable } from '@angular/core';


@Injectable()
export class ToasterConfigurationService {

	public static TOASTER_CONFIG = {
		mouseoverTimerStop: true,
		// timeout: -1, # Prevents automatic dismissal after timeout
		animation: 'flyRight',
		positionClass: 'toast-bottom-right'
	};

}
