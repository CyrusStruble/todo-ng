/**
 * Define the Todo model.
 */

import uuid from 'uuid';

export class Todo {
	id: string;
	listId: string;
	description: string;
	dueOn: string;
	createdOn: string;
	state: string;

	constructor(obj?: any) {
		this.id 			= obj && obj.id || uuid();
		this.listId			= obj && obj.listId || null;
		this.description 	= obj && obj.description || '';
		this.dueOn			= obj && obj.dueOn || '';
		this.createdOn		= obj && obj.createdOn || '';
		this.state		= obj && obj.state || 'incomplete';
	}
}
