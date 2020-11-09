import {Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
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
import { AppState } from '../../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
import {WaterTransactionDataSource} from "../../../../../core/water/transaction/transcation.datasource";
import {WaterTransactionModel} from "../../../../../core/water/transaction/transaction.model";
import {SubheaderService} from "../../../../../core/_base/layout";
import {WaterTransactionService} from "../../../../../core/water/transaction/transaction.service";
import {WaterTransactionDeleted, WaterTransactionPageRequested} from "../../../../../core/water/transaction/transaction.action";
// import {PowerTransactionModel} from '../../../../../core/power/transaction/transaction.model';
import { QueryWaterTransactionModel } from '../../../../../core/water/transaction/querytransaction.model';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  	selector: 'kt-list-transaction',
  	templateUrl: './list-transaction.component.html',
  	styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit, OnDestroy {
	file;
	dataSource: WaterTransactionDataSource;
	displayedColumns = ['watname', 'unit', 'startpos', 'endpos', 'billmonth', 'billamount', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	
	// Selection
	selection = new SelectionModel<WaterTransactionModel>(true, []);
	waterTransactionResult: WaterTransactionModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: WaterTransactionService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private http: HttpClient,
		private modalService: NgbModal,
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
				this.loadWaterTransactionList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadWaterTransactionList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Water Consumption');

		// Init DataSource
		this.dataSource = new WaterTransactionDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.waterTransactionResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		this.loadWaterTransactionList();
  	}
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();

		filter.watname = `${searchText}`;

		return filter;
	}
	loadWaterTransactionList() {
		this.selection.clear();
		const queryParams = new QueryWaterTransactionModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new WaterTransactionPageRequested({ page: queryParams }));
		this.selection.clear();
	}
	deleteWaterTransaction(_item: WaterTransactionModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Water Consumption Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this water consumption?';
		const _waitDesciption = 'Water consumption is deleting...';
		const _deleteMessage = `Water consumption has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new WaterTransactionDeleted({ id: _item._id }));
			this.ngOnInit();
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}
	fetchPowerTransaction() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.wat.nmmtr} , Rate: Rp. ${elem.wat.rte.rte}, Unit: ${elem.wat.unt.nmunt}, Bill: ${elem.billamnt}`,
				id: elem._id.toString(),
				status: elem.wat.nmmtr
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.waterTransactionResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.waterTransactionResult.length) {
			this.selection.clear();
		} else {
			this.waterTransactionResult.forEach(row => this.selection.select(row));
		}
	}
	editWaterTransaction(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	export(){
		this.service.exportExcel().subscribe(
		);
	}
  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
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

		this.http.post<any>('http://localhost:3000/api/excel/upload/waterconsumption', formData).subscribe(
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
