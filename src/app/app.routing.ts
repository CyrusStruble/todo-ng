/**
 * Define application routes.
 */

import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginComponent },
	// Otherwhise redirect home
	{ path: '**', redirectTo: 'dashboard' }
];

export const routing = RouterModule.forRoot(appRoutes);