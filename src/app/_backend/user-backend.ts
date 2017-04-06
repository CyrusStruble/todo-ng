/**
 * Mock User Backend
 *
 * Provide local storage and methods for fetching, creating, deleting, and authenticating users.
 */

import { Response, ResponseOptions } from '@angular/http';
import { MockConnection } from '@angular/http/testing';

import { BackendHelper } from '../_helpers/index';

import * as bcrypt from 'bcryptjs';

export class UserBackend {
	users: any[];

	constructor() {
		this.users = JSON.parse(localStorage.getItem('users')) || [];
	}

	/**
	 * Return an array of Users.
	 */
	get(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			connection.mockRespond(new Response(new ResponseOptions({
				status: 200,
				body: this.users
			})));
		}
	}

	/**
	 * Create a new user.
	 */
	create(connection: MockConnection): void {
		let newUser = JSON.parse(connection.request.getBody());

		// Validation
		const duplicateUser = this.users.filter(user => { return user.username === newUser.username }).length;
		if (duplicateUser) {
			return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
		}

		// Save new user
		newUser.id = this.users.length + 1;
		this.users.push(newUser);
		localStorage.setItem('users', JSON.stringify(this.users));

		// Respond 200 OK
		connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
	}

	/**
	 * Delete a user.
	 */
	delete(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			// find user by id in users array
			const urlParts = connection.request.url.split('/');
			const id = parseInt(urlParts[urlParts.length - 1]);
			for (let i = 0; i < this.users.length; i++) {
				let user = this.users[i];
				if (user.id === id) {
					// delete user
					this.users.splice(i, 1);
					localStorage.setItem('users', JSON.stringify(this.users));
					break;
				}
			}

			// respond 200 OK
			connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
		}
	}

	/**
	 * Authenticate a user.
	 */
	authenticate(connection: MockConnection): void {
		const params = JSON.parse(connection.request.getBody());

		// Find if any user matches login credentials
		const filteredUsers = this.users.filter(user => {
			return (user.username === params.username) && (bcrypt.compareSync(params.password, user.password));
		});

		if (filteredUsers.length) {
			// If login details are valid return 200 OK with user details and fake token
			const user = filteredUsers[0];
			connection.mockRespond(new Response(new ResponseOptions({
				status: 200,
				body: {
					id: user.id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					token: 'fake-jwt-token'
				}
			})));
		} else {
			connection.mockError(new Error('Username or password is incorrect'));
		}
	}
}