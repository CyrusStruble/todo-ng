import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import { User } from '../_models/index';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	model: any = {};
	loading = false;

	constructor(
		private router: Router,
		private userService: UserService,
		private alertService: AlertService
	) { }

	/**
	 * Submit the register form and attempt registration.
	 */
	register() {
		this.loading = true;

		const user = new User(this.model);

		this.userService.create(user)
			.subscribe(
				data => {
					this.alertService.success('Registration successful', true);
					this.router.navigate(['/login']);
				},
				error => {
					this.alertService.error(error);
					this.loading = false
				});
	}

}
