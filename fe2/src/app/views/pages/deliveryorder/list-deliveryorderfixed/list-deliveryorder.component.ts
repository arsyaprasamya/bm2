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

import { DeliveryorderModel } from '../../../../core/deliveryorder/deliveryorder.model';
import { DeliveryorderDeleted, DeliveryorderPageRequested} from '../../../../core/deliveryorder/deliveryorder.action';
import {DeliveryorderDataSource} from '../../../../core/deliveryorder/deliveryorder.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {DeliveryorderService} from '../../../../core/deliveryorder/deliveryorder.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryDeliveryorderModel } from '../../../../core/deliveryorder/querydeliveryorder.model';

@Component({
  selector: 'kt-list-deliveryorder',
  templateUrl: './list-deliveryorder.component.html',
  styleUrls: ['./list-deliveryorder.component.scss']
})
export class ListDoFixedComponent implements OnInit, OnDestroy {
	file;
	dataSource: DeliveryorderDataSource;
	displayedColumns = [ 'doId', 'ticket', 'status','actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<DeliveryorderModel>(true, []);
	deliveryorderResult: DeliveryorderModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: DeliveryorderService,
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
				this.loadDeliveryorderList();
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
				this.loadDeliveryorderList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Delivery Order');

		// Init DataSource
		this.dataSource = new DeliveryorderDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.deliveryorderResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadDeliveryorderList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.doId = `${searchText}`;
		return filter;
	}

	loadDeliveryorderList(){
		this.selection.clear();
		const queryParams = new QueryDeliveryorderModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new DeliveryorderPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteDeliveryorder(_item: DeliveryorderModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Deliveryorder Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this deliveryorder?';
		const _waitDesciption = 'Deliveryorder is deleting...';
		const _deleteMessage = `Deliveryorder has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new DeliveryorderDeleted({ id: _item._id }));
			this.ngOnInit();
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.deliveryorderResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.deliveryorderResult.length) {
			this.selection.clear();
		} else {
			this.deliveryorderResult.forEach(row => this.selection.select(row));
		}
	}

	editDeliveryorder(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}
  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	export(){
		this.service.exportExcel();
	}

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

		this.http.post<any>('http://localhost:3000/api/excel/deliveryorder/import', formData).subscribe(
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
