import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import {AddparkModel} from "../../../../core/addpark/addpark.model";
import {
	selectLastCreatedAddparkId,
	selectAddparkActionLoading,
	selectAddparkById
} from "../../../../core/addpark/addpark.selector";
import {AddparkService} from '../../../../core/addpark/addpark.service';
import { CustomerService } from '../../../../core/customer/customer.service';
import { SelectionModel } from '@angular/cdk/collections';
import { QueryUnitModel } from '../../../../core/unit/queryunit.model';
import { UnitService } from '../../../../core/unit/unit.service';
import { VehicleTypeModel } from '../../../../core/vehicletype/vehicletype.model';
import { VehicleTypeService } from '../../../../core/vehicletype/vehicletype.service';
import { BlockService } from '../../../../core/block/block.service';
import { OwnershipContractService } from '../../../../core/contract/ownership/ownership.service';
import { LeaseContractService } from '../../../../core/contract/lease/lease.service';
import { QueryleaseModel } from '../../../../core/contract/lease/querylease.model';
import { QueryOwnerTransactionModel } from '../../../../core/contract/ownership/queryowner.model';

@Component({
  selector: 'kt-add-addpark',
  templateUrl: './add-addpark.component.html',
  styleUrls: ['./add-addpark.component.scss']
})
export class AddAddParkComponent implements OnInit, OnDestroy {
	// Public properties
	addpark: AddparkModel;
	AddparkId$: Observable<string>;
	oldAddpark: AddparkModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	selection = new SelectionModel<AddparkModel>(true, []);
	addparkForm: FormGroup;
	hasFormErrors = false;
	unitResult: any[] = [];
	customerResult: any[] = [];
	vehicleResult: any[] = [];
	blockResult: any[] = [];
	
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private addparkFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: AddparkService,
		private cservice : CustomerService,
		private uservice : OwnershipContractService,
		private leaseService : LeaseContractService,
		private vservice : VehicleTypeService,
		private bservice : BlockService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectAddparkActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectAddparkById(id))).subscribe(res => {
					if (res) {
						this.addpark = res;
						this.oldAddpark = Object.assign({}, this.addpark);
						this.initAddpark();
					}
				});
			} else {
				this.addpark = new AddparkModel();
				this.addpark.clear();
				this.initAddpark();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initAddpark() {
		this.createForm();
		this.loadVehicleList();
		this.loadBlock();
		this.AvaliableSlot();
		this.loadUnit();
	}

	createForm() {
		if (this.addpark._id){
			this.loadVehicleList();
			this.loadBlock();
			this.addparkForm = this.addparkFB.group({
			codeAddParkLot : [this.addpark.codeAddParkLot],
			unit:  [this.addpark.unit._id],
			customer: [this.addpark.customer],
			vehicle: [this.addpark.vehicle._id],
			vehicleNum: [this.addpark.vehicleNum],
			avaliable : [this.addpark.blockPark.availspace],
			avaliablespace: [this.addpark.avaliablespace],
			blockPark: [this.addpark.blockPark._id],
			space: [{value:this.addpark.space, disabled:true}],
			status : [this.addpark.status],
			unitcustomer : [this.addpark.unitcustomer],
			type : [this.addpark.type],
			parkingRate: [this.addpark.parkingRate],
			});
		}else{
			this.addparkForm = this.addparkFB.group({
				codeAddParkLot : [""],
				unit:  [""],
				customer: [""],
				vehicle: [""],
				vehicleNum: [""],
				blockPark: [""],
				unitcustomer : [""],
				avaliable :[{value:"", disabled:true}],
				status : [""],
				avaliablespace:[{value:"", disabled:true}],
				space: [{value:"", disabled:true}],
				type :[""],
				parkingRate: [""],
			});
		}
	}
	
	loadUnit() {
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.uservice.getAllDataUnit(queryParams).subscribe(
			res => {
				this.unitResult = res.data;
			}
		);
	}

	unitChange(id) {
		const controls = this.addparkForm.controls;
		this.uservice.findOwneshipById(id).subscribe(
			data => {
				controls.customer.setValue(data.data.contact_name);
				controls.unitcustomer.setValue(data.data.unit.cdunt);
				
			}
		);
		this.leaseService.findLeaseById(id).subscribe(
			data => {
				controls.customer.setValue(data.data.contact_name);
				controls.unitcustomer.setValue(data.data.unit.cdunt);
				
			}
		);
		
	}
	

	blkChange(id){
		// this.parkingForm.controls.flr.enable();
		this.bservice.getBlockId(id).subscribe((res) => {
		this.addparkForm.controls.avaliable.setValue(res.data.availspace);
		// this.parkingForm.controls.space.setValue(res.lastConsumtion.avaliablespace);
		this.AvaliableSlot();
		});
	}	

	loadVehicleList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.vservice.getListVehicleType(queryParams).subscribe(
			res => {
				this.vehicleResult = res.data;
			}
		);
	}

	vehicleChange(id){
		const controls = this.addparkForm.controls;
		this.vservice.getVehicleById(id).subscribe(data => {
			controls.space.setValue(data.data.vhtprate);
		});
	}

	AvaliableSlot(){
		const space = this.addparkForm.controls.space.value;
		const avaliable = this.addparkForm.controls.avaliable.value;
		if (avaliable !== 0 && space !== 0 ) {
			this.addparkForm.controls.avaliablespace.setValue(
				(avaliable - space)
			);
		}
	}

	loadBlock() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.bservice.getListBlock(queryParams).subscribe(
			res => {
				this.blockResult = res.data;
			}
		);
	}

	goBackWithId() {
		const url = `/apark`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshAddpark(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/apark/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.addpark = Object.assign({}, this.oldAddpark);
		this.createForm();
		this.hasFormErrors = false;
		this.addparkForm.markAsPristine();
		this.addparkForm.markAsUntouched();
		this.addparkForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.addparkForm.controls;
		/** check form */
		if (this.addparkForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedAddpark = this.prepareAddpark();

		if (editedAddpark._id) {
			this.updateAddpark(editedAddpark, withBack);
			return;
		}

		this.addAddpark(editedAddpark, withBack);
	}
	prepareAddpark(): AddparkModel {
		const controls = this.addparkForm.controls;
		const _addpark = new AddparkModel();
		_addpark.clear();
		_addpark._id = this.addpark._id;
		_addpark.codeAddParkLot = controls.codeAddParkLot.value;
		_addpark.unit = controls.unit.value;
		_addpark.customer = controls.customer.value.toLowerCase();
		_addpark.vehicle = controls.vehicle.value;
		_addpark.vehicleNum = controls.vehicleNum.value;
		_addpark.blockPark = controls.blockPark.value;
		_addpark.unitcustomer = controls.unitcustomer.value;
		_addpark.space = controls.space.value;
		_addpark.type = controls.type.value;
		_addpark.avaliablespace = controls.avaliablespace.value;
		_addpark.parkingRate = controls.parkingRate.value;
		_addpark.status = controls.status.value;
		return _addpark;
	}

	addAddpark( _addpark: AddparkModel, withBack: boolean = false) {
		const addSubscription = this.service.createAddpark(_addpark).subscribe(
			res => {
				const message = `New additional parking successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/apark`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding additional parking | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateAddpark(_addpark: AddparkModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateAddpark(_addpark).subscribe(
			res => {
				const message = `Additional parking successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/apark`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding additional parking | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Additional Parking';
		if (!this.addpark || !this.addpark._id) {
			return result;
		}

		result = `Edit Additional Parking`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
