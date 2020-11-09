// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import { InvoiceDeleted, InvoicePageRequested} from '../../../../core/invoice/invoice.action';
import { selectInvoiceById, } from '../../../../core/invoice/invoice.selector';
import { SubheaderService } from '../../../../core/_base/layout';

import {QueryInvoiceModel} from '../../../../core/invoice/queryinvoice.model';
import {InvoiceModel} from '../../../../core/invoice/invoice.model';
import {InvoiceService} from '../../../../core/invoice/invoice.service';
import { InvoiceDataSource } from '../../../../core/invoice/invoice.datasource';
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
const moment = _rollupMoment || _moment;


@Component({
  selector: 'kt-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss']
})
export class ListAllInvoiceComponent implements OnInit, OnDestroy {
	file;
	dataSource: InvoiceDataSource;
	download_name: string;
	displayedColumns = ['prnt','invoiceno','custname','total','invoicedte','invoicedteout','isclosed','actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	@ViewChild("pdfViewer", { static: true }) pdfViewer: ElementRef;
	lastQuery: QueryInvoiceModel;
	// Selection
	selection = new SelectionModel<InvoiceModel>(true, []);
	invoiceResult: InvoiceModel[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: InvoiceService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private http: HttpClient,
		private modalService: NgbModal
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
				this.loadInvoiceList();
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
				this.loadInvoiceList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Invoice');

		// Init DataSource
		this.dataSource = new InvoiceDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.invoiceResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		this.loadInvoiceList();
	}
	loadInvoiceList() {
		this.selection.clear();
		const queryParams = new QueryInvoiceModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new InvoicePageRequested({ page: queryParams }));
		this.selection.clear();
	}
	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();
		
		filter.invoiceno = `${searchText}`;
		return filter;
	}

	deleteInvoice(_item: InvoiceModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Invoice Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this invoice?';
		const _waitDesciption = 'Invoice is deleting...';
		const _deleteMessage = `Invoice has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new InvoiceDeleted({ id: _item._id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			window.location = window.location;
		});
	}


	editInvoice(id) {
		this.router.navigate(['/invoice/edit', id], { relativeTo: this.activatedRoute });
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	export(){
		this.service.exportExcel();
		// const url = `http://localhost:3000/api/excel/project/export`;
		// return url;
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
	fetchFloor() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				// text: `${elem.nmflr} , Part of ${elem.blk.nmblk}`,
				// id: elem._id.toString(),
				// status: elem.nmflr
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.invoiceResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.invoiceResult.length) {
			this.selection.clear();
		} else {
			this.invoiceResult.forEach(row => this.selection.select(row));
		}
	}

	printInvoice(id) {
		const API_DEPOSIT_URL = "http://localhost:3000/api/invoice";
		var data_url = this.http
			.get(`${API_DEPOSIT_URL}/${id}`)
			.subscribe((res) => {
				const dt: any = res;
				// var crtddt = moment(dt.data.receiveno);
				// 	.utc(false)
				// 	.format("MMYY");
				var crtddt = (dt.data.receiveno);
				this.download_name =
					crtddt 
				console.log(dt.data);
			});
		var mediaType = "application/pdf";
		this.http
			.get(`${API_DEPOSIT_URL}/export2/${id}`, {
				responseType: "arraybuffer",
			})
			.subscribe(
				(response) => {
					let blob = new Blob([response], { type: mediaType });
					var fileURL = URL.createObjectURL(blob);
					window.open(fileURL, '_blank');
				},
				(e) => {
					console.error(e);
				}
			);
	}

	onSubmit(){
		const formData = new FormData();
		formData.append('file', this.file);

		this.http.post<any>('http://localhost:3000/api/excel/invoice/import', formData).subscribe(
			(res) => console.log(res),
			(err) => console.log(err)
		)
	}

}
