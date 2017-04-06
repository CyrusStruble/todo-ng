/**
 * Define the User model.
 */

import * as bcrypt from 'bcryptjs';

export class User {
	id: number;
	username: string;
	password: string;
	firstName: string;
	lastName: string;

	constructor(obj?: any) {
		this.id 		= obj && obj.id || '';
		this.username 	= obj && obj.username || '';
		this.password 	= obj && bcrypt.hashSync(obj.password, 8) || '';
		this.firstName 	= obj && obj.firstName || '';
		this.lastName 	= obj && obj.lastName || '';
	}
};