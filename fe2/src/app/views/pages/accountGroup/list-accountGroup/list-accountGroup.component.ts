// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';

//services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';

import { AccountGroupModel } from '../../../../core/accountGroup/accountGroup.model';
import { AccountGroupDeleted, AccountGroupPageRequested} from '../../../../core/accountGroup/accountGroup.action';
import {AccountGroupDataSource} from '../../../../core/accountGroup/accountGroup.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {AccountGroupService} from '../../../../core/accountGroup/accountGroup.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryAccountGroupModel } from '../../../../core/accountGroup/queryag.model';

@Component({
  selector: 'kt-list-accountGroup',
  templateUrl: './list-accountGroup.component.html',
  styleUrls: ['./list-accountGroup.component.scss']
})
export class ListAccountGroupComponent implements OnInit, OnDestroy {
	file;
	dataSource: AccountGroupDataSource;
	displayedColumns = [ 'acctNo','acctType','acctName','actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<AccountGroupModel>(true, []);
	accountGroupResult: AccountGroupModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: AccountGroupService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private http : HttpClient,
		private modalService : NgbModal
	) { }

  	ngOnInit() {
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadAccountGroupList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadAccountGroupList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Account');

		// Init DataSource
		this.dataSource = new AccountGroupDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.accountGroupResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadAccountGroupList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		const searchNo: number = this.searchInput.nativeElement.value;

		filter.acctNo = `${searchNo}`;
		filter.acctName = `${searchText}`.toLowerCase();
		return filter;
	}

	loadAccountGroupList(){
		this.selection.clear();
		const queryParams = new QueryAccountGroupModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new AccountGroupPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteAccountGroup(_item: AccountGroupModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Account Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this account ?';
		const _waitDesciption = 'Account is deleting...';
		const _deleteMessage = `Account has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new AccountGroupDeleted({ id: _item._id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.ngOnInit();
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.accountGroupResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.accountGroupResult.length) {
			this.selection.clear();
		} else {
			this.accountGroupResult.forEach(row => this.selection.select(row));
		}
	}

	editAccountGroup(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}
  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	// export(){
	// 	this.service.exportExcel();
	// }

	openLarge(content) {
		this.modalService.open(content, {
			size: 'lg'
		});
	}

	selectFile(event) {
		if(event.target.files.length > 0) {
			const file = event.target.files[0];
			this.file = file;
		}
	}


	onSubmit(){
		const formData = new FormData();
		formData.append('file', this.file);

		this.http.post<any>('http://localhost:3000/api/excel/accountGroup/import', formData).subscribe(
			res =>{
				const message = `file successfully has been import.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				this.ngOnInit();
			},
			err => {
				console.error(err);
				const message = 'Error while importing File | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				}
		)
	}
}
