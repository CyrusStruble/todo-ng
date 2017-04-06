import { Component } from '@angular/core';

import { AuthenticationService } from '../_services/index';

import { User } from '../_models/index';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	currentUser: User;

	constructor(private authenticationService: AuthenticationService) {
		this.currentUser = this.authenticationService.getCurrentUser();
	}
}
