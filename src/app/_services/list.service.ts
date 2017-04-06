import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { List } from '../_models/index';

import { BackendHelper } from '../_helpers/index';

@Injectable()
export class ListService {
	// Keep track of the currently selected list
	private _selectedList = new BehaviorSubject<any>(null);

	constructor(private http: Http) { }

	/**
	 * Retrieve lists owned by the given owner ID.
	 * @param {number} id
	 */
	getByOwner(id: number) {
		return this.http.get(`/api/lists/owner/${id}`, BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Retrieve the list with the given list ID.
	 * @param {string} id
	 */
	getById(id: string) {
		return this.http.get(`/api/lists/${id}`, BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Create a new list.
	 * @param {List} list
	 */
	create(list: List) {
		return this.http.post('/api/lists', list, BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Update the given list.
	 * @param {List} list
	 */
	update(list: List) {
		return this.http.put(`/api/lists/${list.id}`, list, BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Delete the list with the given ID.
	 * @param {string} id
	 */
	delete(id: string) {
		return this.http.delete(`/api/lists/${id}`, BackendHelper.JWT()).map((response: Response) => response.json());
	}

	/**
	 * Emit the given list as the currently selected list.
	 * @param {list} list
	 */
	selectList(list: List) {
		this._selectedList.next(list);
	}

	/**
	 * Retrieve the observable stream representing the currently selected list.
	 * @return {Observable<any>}
	 */
	getSelectedList(): Observable<any> {
		return this._selectedList.asObservable();
	}
}
