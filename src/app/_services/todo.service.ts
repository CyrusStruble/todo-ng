import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';

import { ListService, AlertService } from './index';

import { Todo } from '../_models/index';

import { BackendHelper } from '../_helpers/index';

@Injectable()
export class TodoService {
	private _todos: BehaviorSubject<List<Todo>> = new BehaviorSubject(List([]));
	public todos: Observable<List<Todo>> = this._todos.asObservable();

	list: any;

	constructor(private http: Http, private listService: ListService, private alertService: AlertService) {
		this.listService.getSelectedList().subscribe((selectedList) => {
			this.list = selectedList;

			if (this.list) {
				this.loadTodos();
			}
		});
	}

	/**
	 * Retrieve all Todo objects for the currently selected list, emitting them to the _todos stream.
	 */
	loadTodos() {
		let test: Todo[] = [];

		this.http.get('/api/todos', BackendHelper.JWT())
			.map((response: Response) => {
				// Map response to todo array
				let allTodos = response.json();

				// Then map todo array to a todo array filter by selected list ID
				return allTodos.filter((todo) => todo.listId == this.list.id) as List<Todo>;
			}).subscribe(
				(todos) => { 
					this._todos.next(todos); 
				},
				(error) => {
					this.alertService.error(error);
				}
			);
	}

	/**
	 * Create a Todo.
	 * @param {Todo} newTodo
	 */
	create(newTodo: Todo) {
		let todos = List(this._todos.getValue());

		this.http.post('/api/todos', newTodo, BackendHelper.JWT())
			.map((response: Response) => response.json())
			.subscribe(
				() => this.loadTodos(), // Emit the updated Todo collection
				error => {
					this.alertService.error(error);
			});
	}

	/**
	 * Delete a Todo.
	 * @param {Todo} deletedTodo
	 */
	delete(deletedTodo: Todo) {
		let todos = List(this._todos.getValue());
		const index = todos.findIndex((todo: Todo) => todo.id === deletedTodo.id );

		if (index > -1) {
			this.http.delete(`/api/todos/${deletedTodo.id}`, BackendHelper.JWT())
				.map((response: Response) => response.json())
				.subscribe(
					() => {
						todos = todos.remove(index);
						this._todos.next(todos);
					},
					error => {
						this.alertService.error(error);
					});
		}
	}

	deleteAssociatedTodos(id: string) {
		this.http.get('/api/todos', BackendHelper.JWT())
			.map((response: Response) => {
				let allTodos = response.json();

				return allTodos.filter((todo) => todo.listId == id) as Todo[];
			}).flatMap((todos) => {
				return Observable.from(todos);
			}).subscribe((todo) => {
				this.http.delete(`/api/todos/${todo.id}`, BackendHelper.JWT())
					.map((response: Response) => response.json())
					.subscribe(
						() => { },
						error => {
							this.alertService.error(error);
						});
			})

	}

	/**
	 * Update a given Todo.
	 * @param {Todo} updatedTodo
	 */
	update(updatedTodo: Todo) {
		let todos = List(this._todos.getValue());
		const index = todos.findIndex((todo: Todo) => todo.id === updatedTodo.id);

		if (index > -1) {
			this.http.put(`/api/todos/${updatedTodo.id}`, updatedTodo, BackendHelper.JWT())
				.map((response: Response) => response.json())
				.subscribe(
					() => {
						todos = todos.remove(index);
						todos = todos.push(updatedTodo);
						this._todos.next(todos);
					},
					error => {
						this.alertService.error(error);
				});
		}
	}

}
