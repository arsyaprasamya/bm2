// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../../core/_base/crud';
import {
	selectPowerMeterActionLoading,
	selectPowerMeterById
} from "../../../../../core/power/meter/meter.selector";
import {PowerMeterModel} from "../../../../../core/power/meter/meter.model";
import {UnitService} from "../../../../../core/unit/unit.service";
import {FloorService} from "../../../../../core/floor/floor.service";
import {BlockGroupService} from "../../../../../core/blockgroup/blockgroup.service";
import {BlockService} from "../../../../../core/block/block.service";
import {BuildingService} from "../../../../../core/building/building.service";
import {QueryBlockModel} from "../../../../../core/block/queryblock.model";
import {QueryBuildingModel} from "../../../../../core/building/querybuilding.model";
import {QueryFloorModel} from "../../../../../core/floor/queryfloor.model";
import {SelectionModel} from "@angular/cdk/collections";
import {QueryUnitModel} from "../../../../../core/unit/queryunit.model";
import {PowerRateService} from "../../../../../core/power/rate/rate.service";
import {QueryPowerRateModel} from "../../../../../core/power/rate/queryrate.model";
import {PowerMeterService} from '../../../../../core/power';

@Component({
  selector: 'kt-add-meter',
  templateUrl: './add-meter.component.html',
  styleUrls: ['./add-meter.component.scss']
})
export class AddMeterComponent implements OnInit, OnDestroy {
	// Public properties
	powerMeter: PowerMeterModel;
	powerMeterId$: Observable<string>;
	oldPowerMeter: PowerMeterModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	powerMeterForm: FormGroup;
	hasFormErrors = false;
	unitResult: any[] = [];
	rateResult: any[] = [];
	floorResult: any[] = [];
	blockResult: any[] = [];
	blockGroupResult: any[] = [];
	buildingResult: any[] = [];
	selection = new SelectionModel<PowerMeterModel>(true, []);
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private powerMeterFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private serviceRate: PowerRateService,
		private serviceUnit: UnitService,
		private serviceFloor: FloorService,
		private serviceBlkGrp: BlockGroupService,
		private serviceBlk: BlockService,
		private serviceBld: BuildingService,
		private layoutConfigService: LayoutConfigService,
		private service: PowerMeterService
	) { }
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectPowerMeterActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectPowerMeterById(id))).subscribe(res => {
					if (res) {
						this.powerMeter = res;
						this.oldPowerMeter = Object.assign({}, this.powerMeter);
						this.initPowerMeter();
					}
				});
			} else {
				this.powerMeter = new PowerMeterModel();
				this.powerMeter.clear();
				this.initPowerMeter();
			}
		});
		this.subscriptions.push(routeSubscription);
	}
	initPowerMeter() {
		this.loadRateList();
		this.loadBlockGroupList();
		this.createForm();
	}
	createForm() {
		if(this.powerMeter._id){
			this.loadBlockList(this.powerMeter.unt.flr.blk.grpid._id);
			this.loadFloorList(this.powerMeter.unt.flr.blk._id);
			this.loadUnitList(this.powerMeter.unt.flr._id);
			this.powerMeterForm = this.powerMeterFB.group({
				nmmtr: [this.powerMeter.nmmtr, Validators.required],
				unt: [{"value" : this.powerMeter.unt._id, "disabled" : false}, Validators.required],
				flr: [{ "value" : this.powerMeter.unt.flr._id, "disabled" : false}, Validators.required],
				blk: [{ "value" : this.powerMeter.unt.flr.blk._id, "disabled" : false}, Validators.required],
				grpblk: [{ "value" : this.powerMeter.unt.flr.blk.grpid._id, "disabled" : false}, Validators.required],
				rte: [this.powerMeter.rte._id, Validators.required],
			});
		}else{
			this.powerMeterForm = this.powerMeterFB.group({
				nmmtr: ["", Validators.required],
				unt: [{"value": ""}, Validators.required],
				flr: [{ "value" : "", "disabled" : true}, Validators.required],
				blk: [{ "value" : "", "disabled" : true}, Validators.required],
				grpblk: [{ "value" : "", "disabled" : false}, Validators.required],
				rte: ["", Validators.required],
			});
		}

	}
	goBackWithId() {
		const url = `/power-management/power/meter`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	refreshPowerMeter(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/power-management/power/meter/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.powerMeterForm.controls;
		/** check form */
		if (this.powerMeterForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedPowerMeter = this.preparePowerMeter();

		if (editedPowerMeter._id) {
			this.updatePowerMeter(editedPowerMeter, withBack);
			return;
		}

		this.addPowerMeter(editedPowerMeter, withBack);
	}
	preparePowerMeter(): PowerMeterModel {
		const controls = this.powerMeterForm.controls;
		const _powerMeter = new PowerMeterModel();
		_powerMeter.clear();
		_powerMeter._id = this.powerMeter._id;
		_powerMeter.nmmtr = controls.nmmtr.value;
		_powerMeter.unt = controls.unt.value.toLowerCase();
		_powerMeter.rte = controls.rte.value;
		return _powerMeter;
	}
	addPowerMeter( _powerMeter: PowerMeterModel, withBack: boolean = false) {
		const addSubscription = this.service.createPowerMeter(_powerMeter).subscribe(
			res => {
				const message = `New electricity meter successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/power-management/power/meter`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding electricity meter | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	updatePowerMeter(_powerMeter: PowerMeterModel, withBack: boolean = false){
		const addSubscription = this.service.updatePowerMeter(_powerMeter).subscribe(
			res => {
				const message = `Electricity meter successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/power-management/power/meter`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while saving electricity meter | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	getComponentTitle() {
		let result = 'Create Electricity Meter';
		if (!this.powerMeter || !this.powerMeter._id) {
			return result;
		}

		result = `Edit Electricity Meter`;
		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	reset() {
		this.powerMeter = Object.assign({}, this.oldPowerMeter);
		this.createForm();
		this.hasFormErrors = false;
		this.powerMeterForm.markAsPristine();
		this.powerMeterForm.markAsUntouched();
		this.powerMeterForm.updateValueAndValidity();
	}
	loadBlockList(grpid) {
		this.selection.clear();
		const queryParams = new QueryBlockModel(
			null,
			"asc",
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
			"asc",
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
			"asc",
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
	loadFloorList(bldid){
		this.selection.clear();
		const queryParams = new QueryFloorModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.serviceFloor.findFloorByParent(bldid).subscribe(
			res => {
				this.floorResult = res.data;
			}
		);
	}
	loadUnitList(flrid){
		this.selection.clear();
		const queryParams = new QueryUnitModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.serviceUnit.findUnitByParent(flrid).subscribe(
			res => {
				this.unitResult = res.data;
			}
		);
	}
	loadRateList(){
		this.selection.clear();
		const queryParams = new QueryPowerRateModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.serviceRate.getListPowerRate(queryParams).subscribe(
			res => {
				this.rateResult = res.data;
			}
		);
	}
	blockgroupChange(item){
		if(item){
			this.loadBlockList(item);
			this.powerMeterForm.controls.blk.enable();
		}
	};
	blkChange(item){
		if(item){
			this.loadFloorList(item);
			this.powerMeterForm.controls.flr.enable();
		}
	}
	bldChange(item){
		if(item){
			this.loadFloorList(item);
			this.powerMeterForm.controls.flr.enable();
		}
	}
	flrChange(item){
		if(item){
			this.loadUnitList(item);
			this.powerMeterForm.controls.unt.enable();
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
