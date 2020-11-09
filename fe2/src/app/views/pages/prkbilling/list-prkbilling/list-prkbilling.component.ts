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

import { PrkbillingModel } from '../../../../core/prkbilling/prkbilling.model';
import { PrkbillingDeleted, PrkbillingPageRequested} from '../../../../core/prkbilling/prkbilling.action';
import {PrkbillingDataSource} from '../../../../core/prkbilling/prkbilling.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {PrkbillingService} from '../../../../core/prkbilling/prkbilling.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryPrkbillingModel } from '../../../../core/prkbilling/queryprkbilling.model';
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
const moment = _rollupMoment || _moment;

@Component({
  selector: 'kt-list-prkbilling',
  templateUrl: './list-prkbilling.component.html',
  styleUrls: ['./list-prkbilling.component.scss']
})
export class ListPrkbillingComponent implements OnInit, OnDestroy {
	file;
	download_name;
	dataSource: PrkbillingDataSource;
	displayedColumns = [ 
		"prnt",
		"billingNo",
		"Unit",
		"billedTo",
		"billingDate",
		"dueDate",
		"actions",
	];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<PrkbillingModel>(true, []);
	prkbillingResult: PrkbillingModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: PrkbillingService,
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
				this.loadPrkbillingList();
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
				this.loadPrkbillingList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Parking Billing');

		// Init DataSource
		this.dataSource = new PrkbillingDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.prkbillingResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadPrkbillingList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();
		filter.billingNo = `${searchText}`;
		return filter;
	}

	loadPrkbillingList(){
		this.selection.clear();
		const queryParams = new QueryPrkbillingModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new PrkbillingPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deletePrkbilling(_item: PrkbillingModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Prkbilling Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this prkbilling?';
		const _waitDesciption = 'Prkbilling is deleting...';
		const _deleteMessage = `Prkbilling has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new PrkbillingDeleted({ id: _item._id }));
			this.ngOnInit();
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.prkbillingResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.prkbillingResult.length) {
			this.selection.clear();
		} else {
			this.prkbillingResult.forEach(row => this.selection.select(row));
		}
	}

	editPrkbilling(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}
  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	printBilling(id) {
		const API_BILLING_URL = "http://localhost:3000/api/parkingbilling";
		var data_url = this.http
			.get(`${API_BILLING_URL}/${id}`)
			.subscribe((res) => {
				const dt: any = res;
				var crtddt = moment(dt.data.created_date)
					.utc(false)
					.format("MMYY");
				this.download_name =
					crtddt +
					"-" +
					dt.data.unit.cdunt +
					"-" +
					dt.data.billing_number;
				console.log(dt.data);
			});
		var mediaType = "application/pdf";
		this.http
			.get(`${API_BILLING_URL}/create/${id}`, {
				responseType: "arraybuffer",
			})
			.subscribe(
				(response) => {
					let blob = new Blob([response], { type: mediaType });
					var fileURL = URL.createObjectURL(blob);
					var anchor = document.createElement("a");
					// anchor.download = this.download_name + ".pdf";
					// anchor.href = fileURL;
					anchor.click();
					window.open(fileURL, "_blank")
					// const src = fileURL;
				},
				(e) => {
					console.error(e);
				}
			);
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

		this.http.post<any>('http://localhost:3000/api/excel/prkbilling/import', formData).subscribe(
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
