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

import { CategoryModel } from '../../../../core/category/category.model';
import { CategoryDeleted, CategoryPageRequested} from '../../../../core/category/category.action';
import {CategoryDataSource} from '../../../../core/category/category.datasource';
import {SubheaderService} from '../../../../core/_base/layout';
import {CategoryService} from '../../../../core/category/category.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryCategoryModel } from '../../../../core/category/querycategory.model';

@Component({
  selector: 'kt-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit, OnDestroy {
	file;
	dataSource: CategoryDataSource;
	displayedColumns = [ 'categoryid', 'name', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<CategoryModel>(true, []);
	categoryResult: CategoryModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private service: CategoryService,
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
				this.loadCategoryList();
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
				this.loadCategoryList();
			})
		).subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Location');

		// Init DataSource
		this.dataSource = new CategoryDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.categoryResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		this.loadCategoryList();
  	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value.toLowerCase();

		filter.name = `${searchText}`;
		return filter;
	}

	loadCategoryList(){
		this.selection.clear();
		const queryParams = new QueryCategoryModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex+1,
			this.paginator.pageSize
		);
		this.store.dispatch(new CategoryPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	deleteCategory(_item: CategoryModel) {
		// tslint:disable-next-line:variable-name
		const _title = 'Category Delete';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to permanently delete this category?';
		const _waitDesciption = 'Category is deleting...';
		const _deleteMessage = `Category has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new CategoryDeleted({ id: _item._id }));
			this.ngOnInit();
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.categoryResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.categoryResult.length) {
			this.selection.clear();
		} else {
			this.categoryResult.forEach(row => this.selection.select(row));
		}
	}

	editCategory(id) {
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

		this.http.post<any>('http://localhost:3000/api/excel/category/import', formData).subscribe(
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
