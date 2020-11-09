// Angular
import { HttpClient } from "@angular/common/http";
import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	OnDestroy,
	ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// Material
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator, MatSort } from "@angular/material";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
// RXJS
import {
	debounceTime,
	distinctUntilChanged,
	tap,
	skip,
	take,
	delay,
} from "rxjs/operators";
import { fromEvent, merge, Observable, of, Subscription } from "rxjs";
// LODASH
import { each, find } from "lodash";
// NGRX
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../../core/reducers";

// Services
import {
	LayoutUtilsService,
	MessageType,
	QueryParamsModel,
} from "../../../../core/_base/crud";
import { BillingModel } from "../../../../core/billing/billing.model";
import { BillingDatasource } from "../../../../core/billing/billing.datasource";
import {
	BillingDeleted,
	BillingPageRequested,
} from "../../../../core/billing/billing.action";
import { SubheaderService } from "../../../../core/_base/layout";
import { CustomerModel } from "../../../../core/customer/customer.model";
import { BillingService } from "../../../../core/billing/billing.service";
import { PdfViewerModule } from "ng2-pdf-viewer";
// const URL = 'http://localhost:3000/api/excel/project/import';
import {
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	MatDatepicker,
} from "@angular/material";
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
const moment = _rollupMoment || _moment;

const MY_FORMATS = {
	parse: {
		dateInput: "LL",
	},
	display: {
		dateInput: "YYYY-MM-DD",
		monthYearLabel: "YYYY",
		dateA11yLabel: "LL",
		monthYearA11yLabel: "YYYY",
	},
};

@Component({
	selector: "kt-list-billing",
	templateUrl: "./list-billing.component.html",
	styleUrls: ["./list-billing.component.scss"],
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE],
		},
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
})
export class ListBillingComponent implements OnInit, OnDestroy {
	file;
	periode_date;
	download_name: string;
	@ViewChild("pdfViewer", { static: true }) pdfViewer: ElementRef;
	dataSource: BillingDatasource;
	displayedColumns = [
		"select",
		"prnt",
		"billing_number",
		"Unit",
		"billedTo",
		"billing_date",
		"due_date",
		// "tes",
		"actions",
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild("sort1", { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<BillingModel>(true, []);
	billingResult: BillingModel[] = [];
	closeResult: string;

	// Subscriptions
	private subscriptions: Subscription[] = [];

	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: BillingService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private http: HttpClient,
		private modalService: NgbModal,
		private cdr: ChangeDetectorRef
	) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */

	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(
			() => (this.paginator.pageIndex = 0)
		);
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(
			this.sort.sortChange,
			this.paginator.page
		)
			.pipe(
				tap(() => {
					this.loadBillingList();
				})
			)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(
			this.searchInput.nativeElement,
			"keyup"
		)
			.pipe(
				// tslint:disable-next-line:max-line-length
				debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
				distinctUntilChanged(), // This operator will eliminate duplicate values
				tap(() => {
					this.paginator.pageIndex = 0;
					this.loadBillingList();
				})
			)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle("Billing");

		// Init DataSource
		this.dataSource = new BillingDatasource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject
			.pipe(skip(1), distinctUntilChanged())
			.subscribe((res) => {
				this.billingResult = res;
			});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		of(undefined)
			.pipe(take(1), delay(1000))
			.subscribe(() => {
				// Remove this line, just loading imitation
				this.loadBillingList();
			});
		this.loadBillingList();
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
	
	/**
	 * Returns object for filter
	 */


	loadBillingList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex + 1,
			this.paginator.pageSize
		);
		this.store.dispatch(new BillingPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.billing_number = `${searchText}`;
		return filter;
	}


	deleteBilling(_item: BillingModel) {
		// tslint:disable-next-line:variable-name
		const _title = "Billing Delete";
		// tslint:disable-next-line:variable-name
		const _description = "Are you sure to permanently delete this billing?";
		const _waitDesciption = "Billing is deleting...";
		const _deleteMessage = `Billing has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.store.dispatch(new BillingDeleted({ id: _item._id }));
			this.ngOnInit();
			this.layoutUtilsService.showActionNotification(
				_deleteMessage,
				MessageType.Delete
			);
		});
	}

	fetchBilling() {
		const messages = [];
		this.selection.selected.forEach((elem) => {
			messages.push({
				text: `${elem.billing_number} , ${elem.billing_number}`,
				id: elem._id.toString(),
				status: elem.billing_number,
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.billingResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.billingResult.length) {
			this.selection.clear();
		} else {
			this.billingResult.forEach((row) => this.selection.select(row));
		}
	}

	editBilling(id) {
		this.router.navigate(["edit", id], { relativeTo: this.activatedRoute });
	}

	printBilling(id) {
		const API_BILLING_URL = "http://localhost:3000/api/billing";
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

	open(content) {
		this.modalService.open(content).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			}
		);
	}
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return "by pressing ESC";
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return "by clicking on a backdrop";
		} else {
			return `with: ${reason}`;
		}
	}

	openLarge(content) {
		this.modalService.open(content, {
			size: "lg",
		});
	}
	auto() {
		const API_BILLING_URL = "http://localhost:3000/api/billing/autocreate";
		var data_url = this.http
			.post(`${API_BILLING_URL}`, {
				date: this.periode_date,
			})
			.subscribe(
				res => {
					const message = `Auto Generate successfully has been added.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
					const url = `/billing`;
					this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
					this.ngOnInit();
				},
				err => {
					console.error(err);
					const message = 'Error while adding billing | ' + err.statusText;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				}
			);
			this.ngOnInit();
	}
	changePeriode(event) {
		this.periode_date = event.value.format("YYYY-MM-DD");
	}
	selectFile(event) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			this.file = file;
		}
	}

	onSubmit() {
		const formData = new FormData();
		formData.append("file", this.file);

		this.http
			.post<any>(
				"http://localhost:3000/api/excel/project/import",
				formData
			)
			.subscribe(
				res => {
					const message = `file successfully has been imported.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
					const url = `/billing`;
					this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
					this.ngOnInit();
				},
				err => {
					console.error(err);
					const message = 'Error while adding billing | ' + err.statusText;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
				}
			);
	}

	export(){
		this.service.exportExcel().subscribe(	
		);
	}
}
