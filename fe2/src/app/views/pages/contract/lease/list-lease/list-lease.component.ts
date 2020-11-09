import { AfterViewInit, AfterViewChecked } from '@angular/core';
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
import { AppState } from '../../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';
import { LeaseContractModel } from '../../../../../core/contract/lease/lease.model';
import { LeaseContractDataSource } from '../../../../../core/contract/lease/lease.datasource';
import { LeaseContractDeleted, LeaseContractPageRequested } from '../../../../../core/contract/lease/lease.action';
import { SubheaderService } from '../../../../../core/_base/layout';
import { QueryleaseModel } from '../../../../../core/contract/lease/querylease.model';
import { CustomerModel } from '../../../../../core/customer/customer.model';
import { LeaseContractService } from '../../../../../core/contract/lease/lease.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'kt-list-lease',
  templateUrl: './list-lease.component.html',
  styleUrls: ['./list-lease.component.scss']
})
export class ListLeaseComponent implements OnInit, OnDestroy {
	file;
	dataSource: LeaseContractDataSource;
	displayedColumns = ['select', 'contract_number', 'customername', 'unit','contract_date','expiry_date',  'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryleaseModel;
	// Selection
	selection = new SelectionModel<LeaseContractModel>(true, []);
	leaseResult: LeaseContractModel[] = [];

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
		private service: LeaseContractService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private http : HttpClient,
		private modalService : NgbModal,
		) { }
		

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadLeaseList();
			})
		).subscribe();
		this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadLeaseList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Lease Contract');

		// Init DataSource
		this.dataSource = new LeaseContractDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.leaseResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadLeaseList();
		});
		this.loadLeaseList();
	}

	ngOnDestroy(){
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	loadLeaseList() {
		this.selection.clear();
		const queryParams = new QueryleaseModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new LeaseContractPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.contract_number =  `${searchText}`;
		return filter;
	}

	deleteLease(_item: LeaseContractModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Lease Contract Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this lease contract?';
		const _waitDesciption = 'Lease contract is deleting...';
		const _deleteMessage = `Lease contract has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new LeaseContractDeleted({ id: _item._id }));
			this.ngOnInit()
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	fetchLease() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.contract_number} , ${elem.contract_date}`,
				id: elem._id.toString(),
				status: elem.contract_number
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.leaseResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.leaseResult.length) {
			this.selection.clear();
		} else {
			this.leaseResult.forEach(row => this.selection.select(row));
		}
	}

	editLease(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
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

		this.http.post<any>('http://localhost:3000/api/excel/watermas/import', formData).subscribe(
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
