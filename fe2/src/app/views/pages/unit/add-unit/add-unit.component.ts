import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutConfigService, SubheaderService} from '../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../core/_base/crud';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../core/reducers';
import {SelectionModel} from '@angular/cdk/collections';
import {UnitDataSource} from '../../../../core/unit/unit.datasource';
import {BlockService} from '../../../../core/block/block.service';
import {BlockGroupService} from '../../../../core/blockgroup/blockgroup.service';
import {BuildingService} from '../../../../core/building/building.service';
import {selectLastCreatedUnitId, selectUnitActionLoading} from '../../../../core/unit/unit.selector';
import {QueryBlockModel} from '../../../../core/block/queryblock.model';
import {FloorService} from '../../../../core/floor/floor.service';
import {QueryBuildingModel} from '../../../../core/building/querybuilding.model';
import {UnitModel} from '../../../../core/unit/unit.model';
import {UnitService} from '../../../../core/unit/unit.service';
import {QueryFloorModel} from '../../../../core/floor/queryfloor.model';
import {UnitOnServerCreated} from '../../../../core/unit/unit.action';
import {UnitTypeService} from '../../../../core/unittype/unittype.service';
import {UnitRateService} from '../../../../core/unitrate/unitrate.service';

@Component({
  selector: 'kt-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit, OnDestroy {
	dataSource: UnitDataSource;
	unit: UnitModel;
	floorId$: Observable<string>;
	oldUnit: UnitModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	unitForm: FormGroup;
	hasFormErrors = false;
	selection = new SelectionModel<UnitModel>(true, []);
	floorResult: any[] = [];
	blockResult: any[] = [];
	blockResultName: any[] = [];
	blockGroupResult: any[] = [];
	buildingResult: any[] = [];
	unitTypeResult: any[] = [];
	unitRateResult: any[] = [];
	cdunit: any[] = [];
	blkCode: String = undefined;
	flrCode: String = undefined;
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private unitFB: FormBuilder,
		private subheaderService: SubheaderService,
		private service: UnitService,
		private serviceFloor: FloorService,
		private serviceBlkGrp: BlockGroupService,
		private serviceBlk: BlockService,
		private serviceBld: BuildingService,
		private serviceUnttp: UnitTypeService,
		private serviceUntRate: UnitRateService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService
	) { }
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectUnitActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			this.unit = new UnitModel();
			this.unit.clear();
			this.initUnit();
		});
		this.subscriptions.push(routeSubscription);
		this.formChange();
	}
	initUnit(){
		this.createForm();
		this.loadBlockGroupList();
		this.loadUnitType();
		this.loadUnitRate();
		
	}
	createForm() {
		this.unitForm = this.unitFB.group({
			nmunt : ["", Validators.required],
			cdunt: [{"value":this.cdunit, "disabled":true}, Validators.required],
			untnum : ["", Validators.required],
			unttp : ["", Validators.required],
			untrt : ["", Validators.required],
			untsqr : ["", Validators.required],
			sinkingfund : ["", Validators.required],
			srvcrate : ["", Validators.required],
			ovstyrate : ["", Validators.required],
			grpblk: ["", Validators.required],
			price : [""],
			rentalPrice : [""],
			blk: [{ "value" : "", "disabled" : true}, Validators.required],
			flr: [{ "value" : "", "disabled" : true}, Validators.required],
		});

	}
	goBackWithId() {
		const url = `/unit`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	refreshUnit(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/unit/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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
				console.log(this.blockGroupResult)
			}
		);
	}
	loadBlockGroupName(grpid) {
		this.serviceBlkGrp.getBlockGroupById(grpid).subscribe(
			res => {
				this.blockResult = res.data;
				// alert(this.blockResult)
			}
		);
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
	loadBlockName(blkid) {
		this.selection.clear();
		this.serviceBlk.findBlockById(blkid).subscribe(
			res => {
				this.blockResult = Object.assign([res.data]);
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
	loadUnitType() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.serviceUnttp.getListUnitType(queryParams).subscribe(
			res => {
				this.unitTypeResult = res.data;
			}
		);
	}

	loadUnitRate() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.serviceUntRate.getListUnitRate(queryParams).subscribe(
			res => {
				this.unitRateResult = res.data;
			}
		);
	}
	loadFloorName(bldid) {
		this.selection.clear();
		this.serviceFloor.findFloorById(bldid).subscribe(
			res => {
				this.floorResult = Object.assign([res.data]);
			}
		);
	}
	blockgroupChange(item){
		if(item){
			this.loadBlockList(item);
			this.unitForm.controls.blk.enable();
		}
	};
	getUnitType(id){
		if(id){
			this.serviceUnttp.findUnitTypeById(id).subscribe(
				res => {
					var data = res.data;
					this.unitForm.controls.untsqr.setValue(data.untsqr);
				}
			);
		}
	}

	getUnitRate(id){
		if(id){
			this.serviceUntRate.findUnitRateById(id).subscribe(
				res => {
					var data = res.data;
					this.unitForm.controls.sinkingfund.setValue(data.sinking_fund);
					this.unitForm.controls.srvcrate.setValue(data.service_rate);
					this.unitForm.controls.ovstyrate.setValue(data.overstay_rate);
					this.unitForm.controls.price.setValue(data.rentPrice);
					this.changeRental()
				}
			);
		}
	}


	changeRental() {
		const size = this.unitForm.controls.untsqr.value;
		const price = this.unitForm.controls.price.value;
		if (size !== 0 && price !== 0 ) {
			this.unitForm.controls.rentalPrice.setValue(
				(size * price)
			);
		}
	}
	
	blkChange(item){
		if(item){
			this.loadFloorList(item);
			this.unitForm.controls.flr.enable();
		}
	}
	bldChange(item){
		if(item){
			this.loadFloorList(item);
			this.unitForm.controls.flr.enable();
		}
	}
	prepareUnit(): UnitModel {
		const controls = this.unitForm.controls;
		const _unit = new UnitModel();
		_unit.clear();
		_unit.cdunt = controls.cdunt.value.toLowerCase();
		_unit.nmunt = controls.nmunt.value.toLowerCase();
		_unit.untnum = controls.untnum.value;
		_unit.unttp = controls.unttp.value.toLowerCase();
		_unit.untrt = controls.untrt.value.toLowerCase();
		_unit.untsqr = controls.untsqr.value;
		_unit.sinkingfund = controls.sinkingfund.value;
		_unit.srvcrate = controls.srvcrate.value;
		_unit.ovstyrate = controls.ovstyrate.value;
		_unit.price = controls.price.value;
		_unit.rentalPrice = controls.rentalPrice.value;	
		_unit.flr = controls.flr.value;
		return _unit;
	}

	reset() {
		this.unit = Object.assign({}, this.oldUnit);
		this.createForm();
		this.hasFormErrors = false;
		this.unitForm.markAsPristine();
		this.unitForm.markAsUntouched();
		this.unitForm.updateValueAndValidity();
	}
	addUnit(_unit: UnitModel, withBack: boolean = false) {
		const addSubscription = this.service.createUnit(_unit).subscribe(
			res => {
				const message = `New unit successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/unit`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding unit | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.unitForm.controls;
		/** check form */
		if (this.unitForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const preparedUnit = this.prepareUnit();
		this.addUnit(preparedUnit, withBack);
	}
	getComponentTitle() {
		let result = 'Create Unit';

		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	ngOnDestroy(){
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	
	setCodeBlock(value){
		return this.blkCode = value;
	}
	setCodeFloor(value){
		return this.flrCode = value;
	}
	getCodeFlr(){
		return this.flrCode;
	}
	getCodeBlk(){
		return this.blkCode;
	}
	getCode(blkid:string, flrid:string){
		return new Promise(async (resolve, reject) => {
			await this.serviceBlk.findBlockByIdPlain(blkid).subscribe(value => {
				this.setCodeBlock(value.data.cdblk);
			});
			await this.serviceFloor.findFloorByIdPlain(flrid).subscribe(value => {
				this.setCodeFloor(value.data.cdflr);
			});
			return resolve();
		});

	}
	formChange(){
		this.unitForm.valueChanges.subscribe(data=>{
			if('blk' in data){
				if(data.blk != ""){
					//console.log(data.blk);
					this.serviceBlk.findBlockByIdPlain(data.blk).subscribe(value => {
						this.setCodeBlock(value.data.cdblk);
					});
				}
			}
			if('flr' in data){
				if(data.flr != ""){
					//console.log(data.flr);
					this.serviceFloor.findFloorByIdPlain(data.flr).subscribe(value => {
						this.setCodeFloor(value.data.cdflr);
					});
				}
			}
		});
	}

	generateCode() {
		if (this.unitForm.controls.untnum.value !== "" && this.unitForm.controls.flr.value !== "" && this.unitForm.controls.blk.value !== "") {
			this.unitForm.controls.cdunt.setValue(`${this.getCodeFlr()}/${this.unitForm.controls.untnum.value} ${this.getCodeBlk()}`);
		} else {
			this.layoutUtilsService.showActionNotification("Please fill unit number, floor, block value", MessageType.Create, 2000, true, false);
		}

	}
}
