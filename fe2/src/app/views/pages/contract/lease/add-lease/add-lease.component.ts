import { Component, OnInit, OnDestroy } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LeaseContractModel} from '../../../../../core/contract/lease/lease.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutConfigService, SubheaderService} from '../../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../../core/_base/crud';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../core/reducers';
import {
	selectLeaseContractActionLoading,
	selectLeaseContractById,
	selectLastCreatedLeaseContractId
} from '../../../../../core/contract/lease/lease.selector';
import {LeaseContractOnServerCreated} from '../../../../../core/contract/lease/lease.action';
import {SelectionModel} from '@angular/cdk/collections';
import {LeaseContractDataSource} from '../../../../../core/contract/lease/lease.datasource';
import {CustomerService} from '../../../../../core/customer/customer.service';
import {UnitService} from '../../../../../core/unit/unit.service';
import {selectCustomerActionLoading} from '../../../../../core/customer/customer.selector';
import {selectUnitActionLoading} from '../../../../../core/unit/unit.selector';
import {QueryUnitModel} from '../../../../../core/unit/queryunit.model';
import {LeaseContractService} from '../../../../../core/contract/lease/lease.service';
import { BlockService } from '../../../../../core/block/block.service';
import { QueryBlockModel } from '../../../../../core/block/queryblock.model';
import { QueryFloorModel } from '../../../../../core/floor/queryfloor.model';
import { FloorService } from '../../../../../core/floor/floor.service';
import { StateService } from '../../../../../core/state/state.service';

@Component({
  selector: 'kt-add-lease',
  templateUrl: './add-lease.component.html',
  styleUrls: ['./add-lease.component.scss']
})
export class AddLeaseComponent implements OnInit, OnDestroy {
	dataSource: LeaseContractDataSource;
	lease: LeaseContractModel;
	leaseId$: Observable<string>;
	oldLease: LeaseContractModel;
	selectedTab = 0;
	codenum: any = null;
	loading$: Observable<boolean>;
	uloading$: Observable<boolean>;
	leaseForm: FormGroup;
	hasFormErrors = false;
	selection = new SelectionModel<LeaseContractModel>(true, []);
	customerResult: any[] = [];
	unitResult: any[] = [];
	blockResult: any[] = [];
	floorResult: any[]=[];
	postalcodeResult: any[] = [];
	isHidden: boolean = true;
	TaxId: boolean = true;
	isPkp: boolean = false;
	// Private Properties
	private subscriptions: Subscription[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private leaseFB: FormBuilder,
				private subheaderService: SubheaderService,
				private service: LeaseContractService,
				private cservice: CustomerService,
				private uservice: UnitService,
				private serviceBlk: BlockService,
				private stateService: StateService,
				private serviceFloor: FloorService,
				private layoutUtilsService: LayoutUtilsService,
				private store: Store<AppState>,
				private layoutConfigService: LayoutConfigService) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectCustomerActionLoading));
		this.uloading$ = this.store.pipe(select(selectUnitActionLoading));
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			this.lease = new LeaseContractModel();
			this.lease.clear();
			this.initLease()
		});
		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initLease(){
		this.createForm();
		this.loadCustomerList();
		this.loadBlockList();
	}
	showHidden(){
		this.isHidden = true;
	}
	createForm() {
		this.leaseForm = this.leaseFB.group({
			cstmr : ["", Validators.required],
			contract_number : ["", Validators.required],
			contract_date: ["", Validators.required],
			expiry_date: ["", Validators.required],
			contact_name: ["", Validators.required],
			contact_address: [{value:"", disabled:true}, Validators.required],
			contact_phone: ["", Validators.required],
			contact_email: [{value:"", disabled:true}, Validators.required],
			contact_city: [{value:"",disabled:true}, Validators.required],
			contact_zip: [{value:"",disabled:true}, Validators.required],
			paymentType: ["", Validators.required],
			paymentTerm: ["", Validators.required],
			start_electricity_stand: ["", Validators.required],
			start_water_stand: ["", Validators.required],
			virtualAccount: ["", Validators.required],
			isPKP: ["", Validators.required],
			tax_id: [""],
			blockId:[""],
			floorId:[""],
			unit: ["", Validators.required],
			typeLease : [""]
		});
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
		this.addLease(preparedLease, withBack);
	}

	loadCustomerList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.cservice.getListCustomer(queryParams).subscribe(
			res => {
				this.customerResult = res.data;
			}
		);
	}



	prepareLease(): LeaseContractModel {
		const controls = this.leaseForm.controls;
		const _lease = new LeaseContractModel();
		_lease.clear();
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
		return _lease;
	}

	addLease(_lease: LeaseContractModel, withBack: boolean = false) {
		const addSubscription = this.service.createLeaseContract(_lease).subscribe(
			res => {
				const message = `New lease contract successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/contract-management/contract/lease`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding lease contract | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	getSingleCustomer(id){
		const controls = this.leaseForm.controls;
		this.cservice.getCustomerById(id).subscribe(data => {
			controls.contact_name.setValue(data.data.cstrmrnm);
			controls.contact_address.setValue(data.data.addrcstmr);
			controls.contact_phone.setValue(data.data.phncstmr);
			controls.contact_email.setValue(data.data.emailcstmr);
			controls.contact_city.setValue(data.data.idvllg.district.regency.name);
			this.loadPostalcode(data.data.idvllg.district.name)
			controls.contact_zip.setValue(data.data.postcode);
			controls.tax_id.setValue(data.data.npwp);
		});
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
	getComponentTitle() {
		let result = 'Create Lease Contract';

		return result;
	}
	getNumber(id) {
		this.service.generateLeaseCode(id).subscribe(
			res => {
				const controls = this.leaseForm.controls;
				controls.contract_number.setValue(res.data);
			}
		)
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
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
