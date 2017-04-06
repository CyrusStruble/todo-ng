/**
 * Mock Todo Backend
 *.
 */

import { Response, ResponseOptions } from '@angular/http';
import { MockConnection } from '@angular/http/testing';

import { BackendHelper } from '../_helpers/index';

export class TodoBackend {
	todos: any[];

	constructor() {
		this.todos = JSON.parse(localStorage.getItem('todos')) || [];
	}

	/**
	 * Return an array of todos.
	 */
	get(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			connection.mockRespond(new Response(new ResponseOptions({
				status: 200,
				body: this.todos
			})));
		}
	}

	/**
	 * Return an array of Todos associated with the given list ID.
	 */
	getByListId(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			const urlParts = connection.request.url.split('/');
			const id = urlParts[urlParts.length - 1];

			const todosByListId = this.todos.filter(todo => { return todo.listId === id});

			// Return 200 OK with the given list
			connection.mockRespond(new Response(new ResponseOptions({
				status: 200,
				body: todosByListId
			})));
		}
	}


	/**
	 * Create a todo.
	 */
	create(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			let newTodo = JSON.parse(connection.request.getBody());

			// Save new todo
			this.todos.push(newTodo);
			localStorage.setItem('todos', JSON.stringify(this.todos));

			// Respond 200 OK
			connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
		}
	}

	/**
	 * Update a todo.
	 */
	update(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			const updatedTodo = JSON.parse(connection.request.getBody());
			
			let index = -1;
			for (let i = 0; i < this.todos.length; i++) {
				if (this.todos[i].id === updatedTodo.id) {
					index = i;
				}
			}

			if (index > -1) {
				this.todos[index] = updatedTodo;
				localStorage.setItem('todos', JSON.stringify(this.todos));

				// Respond 200 OK
				connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

			} else {
				connection.mockError(new Error('Todo not found'));
			}
		}
	}

	/**
	 * Delete a todo.
	 */
	delete(connection: MockConnection): void {
		if (BackendHelper.IsAuth(connection)) {
			const urlParts = connection.request.url.split('/');
			const id = urlParts[urlParts.length - 1];
			for (let i = 0; i < this.todos.length; i++) {
				let todo = this.todos[i];
				if (todo.id === id) {
					this.todos.splice(i, 1);
					localStorage.setItem('todos', JSON.stringify(this.todos));
					break;
				}
			}

			// respond 200 OK
			connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
		}
	}
}