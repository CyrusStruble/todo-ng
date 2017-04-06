/**
 * Filter Todo objects by completion status.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { Todo } from '../_models/index';

@Pipe({
	name: 'todoStatus'
})
export class TodoStatusPipe implements PipeTransform {

	transform(todos: Todo[], state: string): Todo[] {
		if (todos) {
			return todos.filter(todo => todo.state == state);
		} else {
			return <Todo[]>[];
		}
	}
}
