/**
 * Define the List model.
 */

import uuid from 'uuid';

export class List {
	id: string;
	ownerId: number;
	title: string;
	createdOn: string;

	constructor(obj?: any) {
		this.id 		= obj && obj.id || uuid();
		this.ownerId	= obj && obj.ownerId || null;
		this.title 		= obj && obj.title || '';
		this.createdOn	= obj && obj.createdOn || '';
	}
};