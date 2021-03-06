import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService, AlertService } from '../_services/index';

@Component({
	moduleId: module.id,
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	model: any = {};
	loading = false;
	returnUrl: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertService: AlertService) { }

	ngOnInit() {
		// Reset login status
		this.authenticationService.logout();

		// Get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	/**
	 * Submit the login form and attempt authentication.
	 */
	login() {
		this.loading = true;
		this.authenticationService.login(this.model.username, this.model.password)
			.subscribe(
				data => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
	}
}
