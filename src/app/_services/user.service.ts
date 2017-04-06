import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { User } from '../_models/index';

import { BackendHelper } from '../_helpers/index';

@Injectable()
export class UserService {

	constructor(private http: Http) { }

	/**
	 * Retrieve a collection of users.
	 */
	getAll() {
		return this.http.get('/api/users', BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Retrieve a user with the given ID.
	 * @param {number} id
	 */
	getById(id: number) {
		return this.http.get(`/api/users/${id}`, BackendHelper.JWT()).map((response:Response) => response.json());
	}

	/**
	 * Create the given user.
	 * @param {User} user
	 */
	create(user: User) {
		return this.http.post('/api/users', user, BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Update the given user.
	 * @param {User} user
	 */
	update(user: User) {
		return this.http.put(`/api/users/${user.id}`, user, BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Delete the user with the given ID.
	 * @param {number} id
	 */
	delete(id: number) {
		return this.http.delete(`/api/users/${id}`, BackendHelper.JWT()).map((response: Response) => response.json());
	}
}
