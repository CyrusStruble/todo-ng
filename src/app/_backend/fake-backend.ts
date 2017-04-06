/**
 * Fake backend using angular's MockBackend.
 */

import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { UserBackend, ListBackend, TodoBackend } from './index';
import { BackendHelper } from '../_helpers/index';

export let fakeBackendProvider = {
	// Use backend in place of Http service for demo purposes
	provide: Http,
	useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
		
		/**
		 * Local Storage
		 */
		let userBackend: UserBackend = new UserBackend();
		let listBackend: ListBackend = new ListBackend();
		let todoBackend: TodoBackend = new TodoBackend();

		// Configure fake backend
		backend.connections.subscribe((connection: MockConnection) => {
			// Wrap in timeout to simulate server API call
			setTimeout(() => {
				switch (connection.request.method) {
					case RequestMethod.Get:
						// Get users
						if (connection.request.url.endsWith('/api/users')) {
							userBackend.get(connection);
						}

						// Get lists
						if (connection.request.url.endsWith('/api/lists')) {
							listBackend.get(connection);
						}

						// Get lists by owner
						if (connection.request.url.match(/\/api\/lists\/owner\/\d+$/)) {
							listBackend.getByOwner(connection);
						}

						// Get todos
						if (connection.request.url.match('/api/todos')) {
							todoBackend.get(connection);
						}

						break;

					case RequestMethod.Post:
						// Authenticate
						if (connection.request.url.endsWith('/api/authenticate')) {
							userBackend.authenticate(connection);
						}

						// Create user
						if (connection.request.url.endsWith('/api/users')) {
							userBackend.create(connection);
						}

						// Create list
						if (connection.request.url.endsWith('/api/lists')) {
							listBackend.create(connection);
						}

						// Create todo
						if (connection.request.url.endsWith('/api/todos')) {
							todoBackend.create(connection);
						}

						break;
					
					case RequestMethod.Delete:
						// Delete user
						if (connection.request.url.match(/\/api\/users\/\d+$/)) {
							userBackend.delete(connection);
						}

						// Delete list
						if (connection.request.url.match(/\/api\/lists\/[a-zA-Z0-9]{8}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{12}$/)) {
							listBackend.delete(connection);
						}

						// Delete todo
						if (connection.request.url.match(/\/api\/todos\/[a-zA-Z0-9]{8}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{12}$/)) {
							todoBackend.delete(connection);
						}

						break;

					case RequestMethod.Put:
						// Update list
						if (connection.request.url.match(/\/api\/lists\/[a-zA-Z0-9]{8}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{12}$/)) {
							listBackend.update(connection);
						}

						// Update todo
						if (connection.request.url.match(/\/api\/todos\/[a-zA-Z0-9]{8}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{12}$/)) {
							todoBackend.update(connection);
						}

						break;
				}
			}, 250);
		});

		return new Http(backend, options);
	},
	deps: [ MockBackend, BaseRequestOptions ]
};
