import { Component, OnInit, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ListService, TodoService } from '../_services/index';

import { User, List } from '../_models/index';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

	@Input() currentUser: User;
	lists: List[] = [];
	selectedList: List;

	constructor(private listService: ListService, private todoService: TodoService) { }

	ngOnInit() {
		this.loadLists(true);
		this.listService.getSelectedList().subscribe((selectedList) => { this.selectedList = selectedList; });

	}

	/**
	 * Create a list with the given name.
	 * @param {string} listName
	 */
	createList(listName: string) {
		const newList = new List({ title: listName, ownerId: this.currentUser.id });
		this.listService.create(newList).subscribe(() => { 
			this.loadLists(); // Refresh the lists
			this.onSelect(newList); // Select the new list
		});
	}

	deleteList(list: List) {
		this.listService.delete(list.id).subscribe(() => {
			this.loadLists(true);
		});

		this.todoService.deleteAssociatedTodos(list.id);
	}


	/**
	 * Initialize the collection of lists owned by the currently logged in user.
	 * @param {boolean} firstLoad If true, the first list is automatically selected
	 */
	loadLists(firstLoad = false) {
		if (firstLoad) {
			this.listService.getByOwner(this.currentUser.id).subscribe(lists => { 
				this.lists = lists; 
				this.onSelect(this.lists[0]); // Select first list upon firstLoad
			});
		} else {
			this.listService.getByOwner(this.currentUser.id).subscribe(lists => { this.lists = lists; });
		}
	}

	/**
	 * Select the given list.
	 * @param {List} list
	 */
	onSelect(list: List) {
		this.listService.selectList(list);

	}

	/**
	 * Create a list upon enter keypress.
	 * @param {string} listName
	 */
	onEnter(listName: string) {
		this.createList(listName);
	}

}
