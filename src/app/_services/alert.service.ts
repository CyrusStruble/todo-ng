import { Injectable } from '@angular/core';

import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertService {

	private subject = new Subject<any>();
	private keepAfterNavigationChange = false;

	constructor(private router: Router) {
		router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				if (this.keepAfterNavigationChange) {
					// Only keep for a single navigation change
					this.keepAfterNavigationChange = false;
				} else {
					// Clear alert
					this.subject.next();
				}
			}
		})
	}

	/**
	 * Emit a success message in the alert service.
	 * @param {string} message The message to display
	 * @param {boolean} keepAfterNavigationChange True if the message should stay after navigating once, false otherwise
	 */
	success(message: string, keepAfterNavigationChange = false) {
		this.keepAfterNavigationChange = keepAfterNavigationChange;
		this.subject.next({type: 'success', text: message});
	}

	/**
	 * Emit an error message in the alert service.
	 * @param {string} message The message to display
	 * @param {boolean} keepAfterNavigationChange True if the message should stay after navigating once, false otherwise
	 */
	error(message: string, keepAfterNavigationChange = false) {
		this.keepAfterNavigationChange = keepAfterNavigationChange;
		this.subject.next({type: 'error', text: message});
	}

	/**
	 * Get the message observable.
	 * @return {Observable<any>} Observable containing message stream
	 */
	getMessage(): Observable<any> {
		return this.subject.asObservable();
	}

	/**
	 * Dimiss the current message.
	 */
	dismiss() {
		this.subject.next();
	}
}
