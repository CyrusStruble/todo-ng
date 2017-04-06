/**
 * Mock List Backend
 */

import { Response, ResponseOptions } from '@angular/http';
import { MockConnection } from '@angular/http/testing';

import { BackendHelper } from '../_helpers/index';

export class ListBackend {
	lists: any[];

	constructor() {
		this.lists = JSON.parse(localStorage.getItem('lists')) || [];
	}

	/**
	 * Return an array of lists.
	 */
	get(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			connection.mockRespond(new Response(new ResponseOptions({
				status: 200,
				body: this.lists
			})));
		}
	}

	/**
	 * Return an array of lists by a specific ID.
	 */
	getById(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			const urlParts = connection.request.url.split('/');
			const id = urlParts[urlParts.length - 1];

			const listById = this.lists.filter(list => { return list.id === id});

			// Return 200 OK with the given list
			connection.mockRespond(new Response(new ResponseOptions({
				status: 200,
				body: listById
			})));
		}
	}

	/**
	 * Return array of lists by a specific owner.
	 */
	getByOwner(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			const urlParts = connection.request.url.split('/');
			const id = parseInt(urlParts[urlParts.length - 1]);

			const listsByUser = this.lists.filter(list => { return list.ownerId === id});
			
			// Return 200 OK with the relevant lists
			connection.mockRespond(new Response(new ResponseOptions({
				status: 200,
				body: listsByUser
			})));
		}
	}

	/**
	 * Create a list.
	 */
	create(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			let newList = JSON.parse(connection.request.getBody());

			// Save new list
			this.lists.push(newList);
			localStorage.setItem('lists', JSON.stringify(this.lists));

			// Respond 200 OK
			connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
		}
	}

	/**
	 * Delete a list.
	 */
	delete(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			// find list by id in lists array
			const urlParts = connection.request.url.split('/');
			const id = urlParts[urlParts.length - 1];
			for (let i = 0; i < this.lists.length; i++) {
				let list = this.lists[i];
				if (list.id === id) {
					this.lists.splice(i, 1);
					localStorage.setItem('lists', JSON.stringify(this.lists));
					break;
				}
			}

			// respond 200 OK
			connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
		}
	}

	/**
	 * Update a list.
	 */
	update(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			// Update list
			if (connection.request.url.match(/\/api\/lists\/\d+$/)) {
				const updatedList = JSON.parse(connection.request.getBody());
				
				let index = -1;
				for (let i = 0; i < this.lists.length; i++) {
					if (this.lists[i].id === updatedList.id) {
						index = i;
					}
				}

				if (index > -1) {
					this.lists[index] = updatedList;
					localStorage.setItem('lists', JSON.stringify(this.lists));

					// Respond 200 OK
					connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

				} else {
					connection.mockError(new Error('List not found'));
				}
			}
		}
	}
}