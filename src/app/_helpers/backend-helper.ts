import { Headers, Response, ResponseOptions, RequestOptions } from '@angular/http';
import { MockConnection } from '@angular/http/testing';

export class BackendHelper {
	static IsAuth(connection: MockConnection): boolean {
		// Check for fake auth token in header and return users if valid, this security is implemented server side in a real application
		if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
			return true; // Return true and allow caller to handler response
		} else {
			// Return 401 if not authorized or if token is null or invalid, then return false
			connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));

			return false;
		}
	}

	static JWT() {
		// Create authorization header with jwt token
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));

		if (currentUser && currentUser.token) {
			let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
			return new RequestOptions({ headers: headers });
		}
	}
}