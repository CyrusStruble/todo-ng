import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Fake backend
import { backendProvider } from './_backend/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AlertComponent } from './alert/alert.component';

import { UserService, AuthenticationService, AlertService, ListService, TodoService } from './_services/index';
import { AuthGuard } from './_guards/index';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ListContentComponent } from './list-content/list-content.component';
import { TodoStatusPipe } from './_pipes/todo-status.pipe';


@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		AlertComponent,
		DashboardComponent,
		SidebarComponent,
		ListContentComponent,
		TodoStatusPipe
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		BrowserAnimationsModule,
		NgbModule.forRoot(),
		routing
	],
	providers: [
		UserService,
		AlertService,
		AuthenticationService,
		ListService,
		TodoService,
		AuthGuard,
		// Fake backend providers
		{
			provide: Http,
			deps: [MockBackend, BaseRequestOptions],
			useFactory: backendProvider
		},
		MockBackend,
		BaseRequestOptions
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
