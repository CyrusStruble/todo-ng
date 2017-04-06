import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthenticationService {
	private currentUser = new Subject<any>();

	constructor(private http: Http) { }

	/**
	 * Login a user.
	 * @param {string} username
	 * @param {string} password
	 */
	login(username: string, password: string) {
		return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
			.map((response: Response) => {
				// Login successful if there's a JWT token in the response
				let user = response.json();

				if (user && user.token) {
					// Store user details and jwt token in local storage to keep user logged in between refreshes
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUser.next(user);
				}
			});
	}

	/**
	 * Logout the currently logged in user.
	 */
	logout() {
		// Remove user from local storage to log user out
		localStorage.removeItem('currentUser');
		this.currentUser.next();
	}

	/**
	 * Retrieve the current user from local storage.
	 */
	getCurrentUser() {
		return JSON.parse(localStorage.getItem('currentUser'));
	}
}
