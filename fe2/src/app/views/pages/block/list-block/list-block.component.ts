import { AfterViewInit, AfterViewChecked } from '@angular/core';
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

import { BlockModel} from '../../../../core/block/block.model';
import { BlockDataSource} from '../../../../core/block/block.datasource';
import { BlockDeleted, BlockPageRequested} from '../../../../core/block/block.action';
import { selectBlockById, } from '../../../../core/block/block.selector';
import { SubheaderService } from '../../../../core/_base/layout';
import {QueryBlockModel} from '../../../../core/block/queryblock.model';
import {BlockGroupService} from '../../../../core/blockgroup/blockgroup.service';
import {BlockgroupModel} from '../../../../core/blockgroup/blockgroup.model';
import {BlockService} from '../../../../core/block/block.service';

@Component({
	selector: 'kt-list-block',
	templateUrl: './list-block.component.html',
})
export class ListBlockComponent implements OnInit, OnDestroy {
	file;
	// Table fields
	dataSource: BlockDataSource;
	displayedColumns = ['cdblk', 'nmblk', 'grpnm', 'availspace' ,'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryBlockModel;
	// Selection
	selection = new SelectionModel<BlockModel>(true, []);
	blockResult: BlockModel[] = [];
	blkRes: BlockModel;
	blockGroup: BlockgroupModel;

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
		private service: BlockService,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private http: HttpClient,
		private modalService: NgbModal,
		private cdr: ChangeDetectorRef) {}

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
				this.loadBlockList();
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
				this.loadBlockList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Block');

		// Init DataSource
		this.dataSource = new BlockDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.blockResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		this.loadBlockList();
	}
	
	loadBlockList() {
		this.selection.clear();
		const queryParams = new QueryBlockModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new BlockPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.cdblk = `${searchText}`
		return filter;
	}

	deleteBlock(_item: BlockModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Block Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this block?';
		const _waitDesciption = 'Block is deleting...';
		const _deleteMessage = `Block has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.store.dispatch(new BlockDeleted({ id: _item._id }));
			this.ngOnInit()
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}


	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.blockResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.blockResult.length) {
			this.selection.clear();
		} else {
			this.blockResult.forEach(row => this.selection.select(row));
		}
	}

	editBlock(id) {
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

		this.http.post<any>('http://localhost:3000/api/excel/block/import', formData).subscribe(
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

	ngOnDestroy(){
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
