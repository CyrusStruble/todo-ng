import { Component, OnInit, Input } from '@angular/core';

import { ListService, TodoService } from '../_services/index';

import { List, Todo, User } from '../_models/index';

@Component({
	selector: 'app-list-content',
	templateUrl: './list-content.component.html',
	styleUrls: ['./list-content.component.scss']
})
export class ListContentComponent implements OnInit {
	list: List;
	incompleteVisible: boolean;
	showWelcome: boolean;

	@Input() currentUser: User;

	constructor(private listService: ListService, private todoService: TodoService) {
		this.incompleteVisible = false;
		this.showWelcome = false;
	}

	ngOnInit() {
		this.listService.getSelectedList().subscribe((selectedList) => { 
			this.list = selectedList;
			this.showWelcome = false;
		});

		this.listService.getByOwner(this.currentUser.id).subscribe((lists) => {
			if (lists.length === 0) {
				this.showWelcome = true;
			}
		});
	}

	/**
	 * Create a todo.
	 */
	createTodo(todoDescription: string) {
		todoDescription = todoDescription.trim();

		if (todoDescription) {
			let newTodo = new Todo({ 
				description: todoDescription,
				listId: this.list.id
			});

			this.todoService.create(newTodo);
		}
	}

	/**
	 * Toggle the completion status of a todo.
	 * @param {Todo} todo
	 */
	toggleTodo(todo: Todo) {
		if (todo.state === 'incomplete') {
			todo.state = 'complete';
		} else {
			todo.state = 'incomplete';
		}

		this.todoService.update(todo);
	}

	/**
	 * Delete a todo.
	 * @param {Todo} todo
	 */
	deleteTodo(todo: Todo) {
		this.todoService.delete(todo);
	}

	/**
	 * Submit a new todo upon enter keypress.
	 */
	onEnter(todoDescription: string) {
		this.createTodo(todoDescription);
	}
}
