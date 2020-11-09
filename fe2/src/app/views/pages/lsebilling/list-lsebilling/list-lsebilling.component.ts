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

import { LsebillingModel } from '../../../../core/lsebilling/lsebilling.model';
import { LsebillingDeleted, LsebillingPageRequested} from '../../../../core/lsebilling/lsebilling.action';
import {LsebillingDataSource} from '../../../../core/lsebilling/lsebilling.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {LsebillingService} from '../../../../core/lsebilling/lsebilling.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryLsebillingModel } from '../../../../core/lsebilling/querylsebilling.model';
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
const moment = _rollupMoment || _moment;


@Component({
  selector: 'kt-list-lsebilling',
  templateUrl: './list-lsebilling.component.html',
  styleUrls: ['./list-lsebilling.component.scss']
})
export class ListLeaseBillingComponent implements OnInit, OnDestroy {
	file;
	download_name;
	dataSource: LsebillingDataSource;
	displayedColumns = [ 
		"prnt",
		"billingNo",
		"Unit",
		"billedTo",
		"billingDate",
		"dueDate",
		"actions",
	];
	// 'rentalUnit','rentalTenant','billingDate', 'dueDate','actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	@ViewChild("pdfViewer", { static: true }) pdfViewer: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<LsebillingModel>(true, []);
	lsebillingResult: LsebillingModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: LsebillingService,
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
				this.loadLsebillingList();
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
				this.loadLsebillingList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Lease Billing');

		// Init DataSource
		this.dataSource = new LsebillingDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.lsebillingResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadLsebillingList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.billingNo = `${searchText}`;
		return filter;
	}

	printBilling(id) {
		const API_BILLING_URL = "http://localhost:3000/api/leasebilling";
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
					this.pdfViewer.nativeElement.data = fileURL;
				},
				(e) => {
					console.error(e);
				}
			);
	}

	loadLsebillingList(){
		this.selection.clear();
		const queryParams = new QueryLsebillingModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new LsebillingPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteLsebilling(_item: LsebillingModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Lease Billing Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this lease billing?';
		const _waitDesciption = 'Lease billing is deleting...';
		const _deleteMessage = `Lease billing has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new LsebillingDeleted({ id: _item._id }));
			this.ngOnInit();
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.lsebillingResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.lsebillingResult.length) {
			this.selection.clear();
		} else {
			this.lsebillingResult.forEach(row => this.selection.select(row));
		}
	}

	editLsebilling(id) {
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

		this.http.post<any>('http://localhost:3000/api/excel/lsebilling/import', formData).subscribe(
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
