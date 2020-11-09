import { Component, OnInit, OnDestroy } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutConfigService, SubheaderService} from '../../../../core/_base/layout';
import {BodyModel, LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../core/_base/crud';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../core/reducers';
import {SelectionModel} from '@angular/cdk/collections';
import {FloorDataSource} from '../../../../core/floor/floor.datasource';
import {BlockService} from '../../../../core/block/block.service';
import {BlockGroupService} from '../../../../core/blockgroup/blockgroup.service';
import {BuildingService} from '../../../../core/building/building.service';
import {QueryBlockModel} from '../../../../core/block/queryblock.model';
import {FloorModel} from '../../../../core/floor/floor.model';
import {FloorService} from '../../../../core/floor/floor.service';
import {selectFloorActionLoading, selectLastCreatedFloorId} from '../../../../core/floor/floor.selector';
import {QueryBuildingModel} from '../../../../core/building/querybuilding.model';

@Component({
  selector: 'kt-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss']
})
export class AddFloorComponent implements OnInit, OnDestroy {
	dataSource: FloorDataSource;
	floor: FloorModel;
	floorId$: Observable<string>;
	oldFloor: FloorModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	floorForm: FormGroup;
	hasFormErrors = false;
	selection = new SelectionModel<FloorModel>(true, []);
	blockResult: any[] = [];
	blockGroupResult: any[] = [];
	buildingResult: any[] = [];
	blockgroupNotSelected: boolean = true;
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private floorFB: FormBuilder,
		private subheaderService: SubheaderService,
		private service: FloorService,
		private serviceBlkGrp: BlockGroupService,
		private serviceBlk: BlockService,
		private serviceBld: BuildingService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService
	) { }
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectFloorActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			this.floor = new FloorModel();
			this.floor.clear();
			this.initFloor();
		});
		this.subscriptions.push(routeSubscription);
	}
	initFloor(){
		this.createForm();
		this.loadBlockGroupList();
	}
	createForm() {
		this.floorForm = this.floorFB.group({
			cdflr : ["", Validators.required],
			nmflr : ["", Validators.required],
			grpblk: ["", Validators.required],
			blk: [{ "value" : "", "disabled" : true}, Validators.required],
		});
	}
	goBackWithId() {
		const url = `/floor`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshFloor(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/floor/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}


	loadBlockList(grpid) {
		this.selection.clear();
		const queryParams = new QueryBlockModel(
			null,
			"desc",
			null,
			1,
			1000
		);
		this.serviceBlk.findBlockByParent(grpid).subscribe(
			res => {
				this.blockResult = res.data;
			}
		);
	}

	loadBlockGroupList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"desc",
			null,
			1,
			1000
		);
		this.serviceBlkGrp.getListBlockGroup(queryParams).subscribe(
			res => {
				this.blockGroupResult = res.data;
			}
		);
	}

	loadBuildingList(blkid){
		this.selection.clear();
		const queryParams = new QueryBuildingModel(
			null,
			"desc",
			null,
			1,
			1000
		);
		this.serviceBld.findBuildingByParent(blkid).subscribe(
			res => {
				this.buildingResult = res.data;
			}
		);
	}
	blockgroupChange(item){
		if(item){
			this.loadBlockList(item);
			this.floorForm.controls.blk.enable();
		}
	};
	blkChange(item){
		if(item){
			this.loadBuildingList(item);
			this.floorForm.controls.bld.enable();
		}
	}
	prepareFloor(): FloorModel {
		const controls = this.floorForm.controls;
		const _floor = new FloorModel();
		_floor.clear();
		_floor.cdflr = controls.cdflr.value.toLowerCase();
		_floor.nmflr = controls.nmflr.value.toLowerCase();
		_floor.blk = controls.blk.value;
		return _floor;
	}

	reset() {
		this.floor = Object.assign({}, this.oldFloor);
		this.createForm();
		this.hasFormErrors = false;
		this.floorForm.controls.bld.disable();
		this.floorForm.markAsPristine();
		this.floorForm.markAsUntouched();
		this.floorForm.updateValueAndValidity();
	}
	addFloor(_floor: FloorModel, withBack: boolean = false) {
		const addSubscription = this.service.createFloor(_floor).subscribe(
			res => {
				const message = `New Floor successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/floor`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding Floor | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.floorForm.controls;
		/** check form */
		if (this.floorForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const preparedFloor = this.prepareFloor();
		this.addFloor(preparedFloor, withBack);
	}
	getComponentTitle() {
		let result = 'Create Floor';

		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	ngOnDestroy(){
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
