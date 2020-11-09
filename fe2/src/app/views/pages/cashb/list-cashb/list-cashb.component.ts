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

import { CashbModel } from '../../../../core/cashb/cashb.model';
import { CashbDeleted, CashbPageRequested} from '../../../../core/cashb/cashb.action';
import {CashbDataSource} from '../../../../core/cashb/cashb.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {CashbService} from '../../../../core/cashb/cashb.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryCashbModel } from '../../../../core/cashb/queryb.model';

@Component({
  selector: 'kt-list-cashb',
  templateUrl: './list-cashb.component.html',
  styleUrls: ['./list-cashb.component.scss']
})
export class ListCashBankComponent implements OnInit {
	file;
	dataSource: CashbDataSource;
	displayedColumns = [ 'date', 'voucherno', 'pymnttype', 'paidfrom', 'amount', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<CashbModel>(true, []);
	cashbResult: CashbModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: CashbService,
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
				this.loadCashbList();
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
				this.loadCashbList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Cash Bank');

		// Init DataSource
		this.dataSource = new CashbDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.cashbResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadCashbList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.voucherno = `${searchText}`;
		return filter;
	}

	loadCashbList(){
		this.selection.clear();
		const queryParams = new QueryCashbModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new CashbPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteCashb(_item: CashbModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Cashb Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this cashb?';
		const _waitDesciption = 'Cashb is deleting...';
		const _deleteMessage = `Cashb has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new CashbDeleted({ id: _item._id }));
			this.ngOnInit();
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.cashbResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.cashbResult.length) {
			this.selection.clear();
		} else {
			this.cashbResult.forEach(row => this.selection.select(row));
		}
	}

	editCashb(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}
  	// ngOnDestroy() {
	// 	this.subscriptions.forEach(sb => sb.unsubscribe());
	// }


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

		this.http.post<any>('http://localhost:3000/api/excel/cashb/import', formData).subscribe(
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
