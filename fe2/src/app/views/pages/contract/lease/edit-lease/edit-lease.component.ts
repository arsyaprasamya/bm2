import { Component, OnInit, OnDestroy } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LeaseContractModel} from '../../../../../core/contract/lease/lease.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutConfigService, SubheaderService} from '../../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../../core/_base/crud';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../core/reducers';
import { selectLeaseContractActionLoading,
	selectLeaseContractById,
	selectLastCreatedLeaseContractId
} from '../../../../../core/contract/lease/lease.selector';
import { LeaseContractOnServerCreated, LeaseContractUpdated } from '../../../../../core/contract/lease/lease.action';
import {Update} from '@ngrx/entity';
import {SelectionModel} from '@angular/cdk/collections';
import { UnitModel } from '../../../../../core/unit/unit.model';
import {CustomerService} from '../../../../../core/customer/customer.service';
import {UnitService} from '../../../../../core/unit/unit.service';
import {selectUnitActionLoading} from '../../../../../core/unit/unit.selector';
import {selectCustomerActionLoading} from '../../../../../core/customer/customer.selector';
import {QueryUnitModel} from '../../../../../core/unit/queryunit.model';
import {LeaseContractService} from '../../../../../core/contract/lease/lease.service';
import { BlockService } from '../../../../../core/block/block.service';
import { QueryBlockModel } from '../../../../../core/block/queryblock.model';
import { QueryBuildingModel } from '../../../../../core/building/querybuilding.model';
import { BuildingService } from '../../../../../core/building/building.service';
import { QueryFloorModel } from '../../../../../core/floor/queryfloor.model';
import { FloorService } from '../../../../../core/floor/floor.service';
import { StateService } from '../../../../../core/state/state.service';

@Component({
  selector: 'kt-edit-lease',
  templateUrl: './edit-lease.component.html',
})
export class EditLeaseComponent implements OnInit, OnDestroy {
	lease: LeaseContractModel;
	leaseId$: Observable<string>;
	oldLease: LeaseContractModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	leaseForm: FormGroup;
	selection = new SelectionModel<LeaseContractModel>(true, []);
	hasFormErrors = false;
	customerResult: any[] = [];
	unitResult: any[] = [];
	blockResult: any[] = [];
	buildingResult : any[]=[];
	postalcodeResult: any[] = [];
	floorResult: any[]=[];
	TaxId: boolean;
	isPkp: boolean;
	taxvalue: string;

	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private leaseFB: FormBuilder,
				private subheaderService: SubheaderService,
				private layoutUtilsService: LayoutUtilsService,
				private store: Store<AppState>,
				private service: LeaseContractService,
				private cservice: CustomerService,
				private serviceBlk: BlockService,
				private serviceBld: BuildingService,
				private stateService: StateService,
				private serviceFloor: FloorService,
				private uservice: UnitService,
				private layoutConfigService: LayoutConfigService) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectLeaseContractActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id){
				this.store.pipe(select(selectLeaseContractById(id))).subscribe(res => {
					if (res) {
						this.isPkp = res.isPKP;
						if (this.isPkp == true){
							this.TaxId = false;
							this.taxvalue = res.tax_id;
						} else {
							this.TaxId = true;
						}
						this.lease = res;
						this.oldLease = Object.assign({}, this.lease);
						this.initLease();
					}
				});
			}
		});
		this.loadCustomerList();
		this.subscriptions.push(routeSubscription);
	}

	initLease() {
		this.createForm();
		this.loadBlockList();
		
	}

	blkChange(item){
		if(item){
			this.loadFloorList(item);
			this.leaseForm.controls.flr.enable();
		}
	}
	flrChange(item){
		if(item){
			this.loadUnitList(item);
			this.leaseForm.controls.unt.enable();
		}
	}

	createForm() {
		this.loadFloorList(this.lease.unit.flr.blk._id);
		this.loadUnitList(this.lease.unit.flr._id);
		this.loadPostalcode(this.lease.cstmr.idvllg.district.name)
		this.leaseForm = this.leaseFB.group({
			cstmr : [{value:this.lease.cstmr._id, disabled:true}, Validators.required],
			contract_number : [this.lease.contract_number, Validators.required],
			contract_date : [this.lease.contract_date, Validators.required],
			expiry_date : [this.lease.expiry_date, Validators.required],
			contact_name : [this.lease.contact_name, Validators.required],
			contact_address : [{value:this.lease.contact_address, disabled:true},Validators.required],
			contact_phone : [this.lease.contact_phone, Validators.required],
			contact_email : [{value:this.lease.contact_email, disabled:true}, Validators.required],
			contact_city : [{value:this.lease.contact_city, disabled:true}, Validators.required],
			contact_zip : [{value:this.lease.contact_zip, disabled:true}, Validators.required],
			unit : [this.lease.unit._id, Validators.required],
			paymentType : [this.lease.paymentType, Validators.required],
			paymentTerm : [this.lease.paymentTerm, Validators.required],
			start_electricity_stand : [this.lease.start_electricity_stand, Validators.required],
			start_water_stand : [this.lease.start_water_stand, Validators.required],
			virtualAccount : [this.lease.virtualAccount, Validators.required],
			isPKP: [this.lease.isPKP],
			blockId:[this.lease.unit.flr.blk._id],
			floorId:[this.lease.unit.flr._id],
			tax_id: [this.lease.tax_id],
			typeLease: [this.lease.typeLease]
		})
		
	}

	loadPostalcode(regencyName: string){
		const queryParams = new QueryParamsModel(null,
			"asc",
			"grpnm",
			1,
			10);
		this.stateService.getListPostalcode(queryParams, regencyName).subscribe(
			res => {
				this.postalcodeResult = res.data;
				console.log(res.data)
			}
		);
	}

	

	loadBlockList() {
		this.selection.clear();
		const queryParams = new QueryBlockModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.serviceBlk.getListBlock(queryParams).subscribe(
			res => {
				this.blockResult = res.data;
			}
		);
	}

	loadFloorList(blkid){
		this.selection.clear();
		const queryParams = new QueryFloorModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.serviceFloor.findFloorByParent(blkid).subscribe(
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
		this.uservice.findUnitByParent(flrid).subscribe(
			res => {
				this.unitResult = res.data;
			}
		);
	}
	
	goBackWithId() {
		const url = `/contract-management/contract/lease`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshLease(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/contract-management/contract/lease/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.lease = Object.assign({}, this.oldLease);
		this.createForm();
		this.hasFormErrors = false;
		this.leaseForm.markAsPristine();
		this.leaseForm.markAsUntouched();
		this.leaseForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.leaseForm.controls;
		/** check form */
		if (this.leaseForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const preparedLease = this.prepareLease();
		this.updateLease(preparedLease, withBack);
	}

	prepareLease(): LeaseContractModel {
		const controls = this.leaseForm.controls;
		const _lease = new LeaseContractModel();
		_lease.clear();
		_lease._id = this.lease._id;
		_lease.cstmr = controls.cstmr.value;
		_lease.contract_number = controls.contract_number.value;
		_lease.contract_date = controls.contract_date.value;
		_lease.expiry_date = controls.expiry_date.value;
		_lease.contact_name = controls.contact_name.value.toLowerCase();
		_lease.contact_address = controls.contact_address.value.toLowerCase();
		_lease.contact_phone = controls.contact_phone.value;
		_lease.contact_email = controls.contact_email.value;
		_lease.contact_city = controls.contact_city.value.toLowerCase();
		_lease.contact_zip = controls.contact_zip.value;
		_lease.unit = controls.unit.value.toLowerCase();
		_lease.paymentType = controls.paymentType.value.toLowerCase();
		_lease.paymentTerm = controls.paymentTerm.value;
		_lease.start_electricity_stand = controls.start_electricity_stand.value;
		_lease.start_water_stand = controls.start_water_stand.value;
		_lease.virtualAccount = controls.virtualAccount.value;
		_lease.isPKP = controls.isPKP.value;
		_lease.tax_id = controls.tax_id.value;
		_lease.typeLease = controls.typeLease.value;
		console.log(controls.isPKP.value);
		return _lease;
	}

	updateLease(_lease: LeaseContractModel, withBack: boolean = false) {
		const addSubscription = this.service.updateLeaseContract(_lease).subscribe(
			res => {
				const message = `Lease contract successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/contract-management/contract/lease`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while saving lease contract | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	loadCustomerList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"asc",
			null,
			1,
			10
		);
		this.cservice.getListCustomer(queryParams).subscribe(
			res => {
				this.customerResult = res.data;
			}
		);
	}


	ngOnDestroy(){
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	changePKP(){
		if (this.isPkp == true){
			this.TaxId = false;
			this.showTaxId();
		} else {
			// console.log(this.leaseForm.controls['tax_id']);
			this.TaxId = true;
			this.hiddenTaxId()
		}
	}

	hiddenTaxId(){
		this.leaseForm.controls['tax_id'].setValidators([]);
		this.leaseForm.controls['tax_id'].updateValueAndValidity();
		console.log(this.TaxId);
		console.log(this.leaseForm.get('tax_id'));
	}
	showTaxId(){
		this.leaseForm.controls['tax_id'].setValidators([Validators.required]);
		// this.leaseForm.get('tax_id').setValidators([Validators.required]);
		this.leaseForm.controls['tax_id'].updateValueAndValidity();
		console.log(this.TaxId);
		console.log(this.leaseForm.get('tax_id'));
	}

	getComponentTitle() {
		let result = 'Edit Lease Contract';

		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
