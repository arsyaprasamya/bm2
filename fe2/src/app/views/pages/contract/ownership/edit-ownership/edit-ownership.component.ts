import { Component, OnInit, OnDestroy } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OwnershipContractModel} from '../../../../../core/contract/ownership/ownership.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutConfigService, SubheaderService} from '../../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../../core/_base/crud';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../core/reducers';
import { selectOwnershipContractActionLoading,
	selectOwnershipContractById,
	selectLastCreatedOwnershipContractId
} from '../../../../../core/contract/ownership/ownership.selector';
import { OwnershipContractOnServerCreated, OwnershipContractUpdated } from '../../../../../core/contract/ownership/ownership.action';
import {Update} from '@ngrx/entity';
import {SelectionModel} from '@angular/cdk/collections';
import { UnitModel } from '../../../../../core/unit/unit.model';
import {CustomerService} from '../../../../../core/customer/customer.service';
import {UnitService} from '../../../../../core/unit/unit.service';
import {QueryUnitModel} from '../../../../../core/unit/queryunit.model';
import { BlockService } from '../../../../../core/block/block.service';
import { QueryBlockModel } from '../../../../../core/block/queryblock.model';
import { QueryFloorModel } from '../../../../../core/floor/queryfloor.model';
import { FloorService } from '../../../../../core/floor/floor.service';
import { StateService } from '../../../../../core/state/state.service';

@Component({
  selector: 'kt-edit-ownership',
  templateUrl: './edit-ownership.component.html',
  styleUrls: ['./edit-ownership.component.scss']
})
export class EditOwnershipComponent implements OnInit {

	ownership: OwnershipContractModel;
	ownershipId$: Observable<string>;
	oldOwnership: OwnershipContractModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	ownershipForm: FormGroup;
	selection = new SelectionModel<OwnershipContractModel>(true, []);
	hasFormErrors = false;
	customerResult: any[] = [];
	unitResult: any[] = [];
	blockResult: any[] = [];
	floorResult: any[]=[];
	postalcodeResult: any[] = [];
	TaxId: boolean;
	isPkp: boolean;
	taxvalue: string;

	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private ownershipFB: FormBuilder,
				private subheaderService: SubheaderService,
				private layoutUtilsService: LayoutUtilsService,
				private store: Store<AppState>,
				private cservice: CustomerService,
				private stateService: StateService,
				private serviceBlk: BlockService,
				private serviceFloor: FloorService,
				private uservice: UnitService,
				private layoutConfigService: LayoutConfigService) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectOwnershipContractActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id){
				this.store.pipe(select(selectOwnershipContractById(id))).subscribe(res => {
					if (res) {
						this.isPkp = res.isPKP;
						if (this.isPkp == true){
							this.TaxId = false;
							this.taxvalue = res.tax_id;
						} else {
							this.TaxId = true;
						}
						this.ownership = res;
						this.oldOwnership = Object.assign({}, this.ownership);
						this.initOwnership();
					}
				});
			}
		});
		this.loadCustomerList();
		this.loadPostalcode(this.ownership.cstmr.idvllg.district.name)
		this.subscriptions.push(routeSubscription);
	}

	initOwnership() {
		this.createForm();
		this.loadBlockList();
		
	}

	createForm() {
		this.loadFloorList(this.ownership.unit.flr.blk._id);
		this.loadUnitList(this.ownership.unit.flr._id);
		this.ownershipForm = this.ownershipFB.group({
			cstmr : [this.ownership.cstmr._id, Validators.required],
			contract_number : [this.ownership.contract_number, Validators.required],
			contract_date : [this.ownership.contract_date, Validators.required],
			expiry_date : [this.ownership.expiry_date, Validators.required],
			contact_name : [this.ownership.contact_name, Validators.required],
			contact_address : [this.ownership.contact_address, Validators.required],
			contact_phone : [this.ownership.contact_phone, Validators.required],
			contact_email : [this.ownership.contact_email, Validators.required],
			contact_city : [this.ownership.contact_city, Validators.required],
			contact_zip : [this.ownership.contact_zip, Validators.required],
			unit : [this.ownership.unit._id, Validators.required],
			paymentType : [this.ownership.paymentType, Validators.required],
			paymentTerm : [this.ownership.paymentTerm, Validators.required],
			start_electricity_stand : [this.ownership.start_electricity_stand, Validators.required],
			start_water_stand : [this.ownership.start_water_stand, Validators.required],
			virtualAccount : [this.ownership.virtualAccount, Validators.required],
			isPKP: [this.ownership.isPKP],
			blockId:[this.ownership.unit.flr.blk._id],
			floorId:[this.ownership.unit.flr._id],
			tax_id: [this.ownership.tax_id],
			ktp :[this.ownership.ktp],
			npwp :[this.ownership.npwp]
		})
	}

	loadPostalcode(regencyName: string){
		const queryParams = new QueryParamsModel(null,
			"asc",
			null,
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
			10
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
			10
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
			10
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
			this.ownershipForm.controls.flr.enable();
		}
	}
	flrChange(item){
		if(item){
			this.loadUnitList(item);
			this.ownershipForm.controls.unt.enable();
		}
	}

	goBackWithId() {
		const url = `/contract-management/contract/ownership`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshOwnership(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/contract-management/contract/ownership/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.ownership = Object.assign({}, this.oldOwnership);
		this.createForm();
		this.hasFormErrors = false;
		this.ownershipForm.markAsPristine();
		this.ownershipForm.markAsUntouched();
		this.ownershipForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.ownershipForm.controls;
		/** check form */
		if (this.ownershipForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const preparedOwnership = this.prepareOwnership();
		this.updateOwnership(preparedOwnership, withBack);
	}

	prepareOwnership(): OwnershipContractModel {
		const controls = this.ownershipForm.controls;
		const _ownership = new OwnershipContractModel();
		_ownership.clear();
		_ownership._id = this.ownership._id;
		_ownership.cstmr = controls.cstmr.value.toLowerCase();
		_ownership.contract_number = controls.contract_number.value;
		_ownership.contract_date = controls.contract_date.value;
		_ownership.expiry_date = controls.expiry_date.value;
		_ownership.contact_name = controls.contact_name.value.toLowerCase();
		_ownership.contact_address = controls.contact_address.value.toLowerCase();
		_ownership.contact_phone = controls.contact_phone.value;
		_ownership.contact_email = controls.contact_email.value;
		_ownership.contact_city = controls.contact_city.value.toLowerCase();
		_ownership.contact_zip = controls.contact_zip.value;
		_ownership.unit = controls.unit.value.toLowerCase();
		_ownership.paymentType = controls.paymentType.value.toLowerCase();
		_ownership.paymentTerm = controls.paymentTerm.value;
		_ownership.start_electricity_stand = controls.start_electricity_stand.value;
		_ownership.start_water_stand = controls.start_water_stand.value;
		_ownership.virtualAccount = controls.virtualAccount.value;
		_ownership.isPKP = controls.isPKP.value;
		_ownership.tax_id = controls.tax_id.value;
		_ownership.ktp = controls.ktp.value;
		_ownership.npwp = controls.npwp.value;
		
		return _ownership;
	}

	updateOwnership(_ownership: OwnershipContractModel, withBack: boolean = false) {
		console.log(_ownership._id);
		const updatedOwnership: Update<OwnershipContractModel> = {
			id: _ownership._id,
			changes: _ownership
		};
		this.store.dispatch(new OwnershipContractUpdated({partialOwnershipContract: updatedOwnership, ownershipcontract: _ownership}));
		const message = `Ownership successfully has been saved.`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (withBack) {
			this.goBackWithId();
		} else {
			this.refreshOwnership(false);
			const url = `/contract-management/contract/ownership`;
			this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		}
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
		this.ownershipForm.controls['tax_id'].setValidators([]);
		this.ownershipForm.controls['tax_id'].updateValueAndValidity();
		console.log(this.TaxId);
		console.log(this.ownershipForm.get('tax_id'));
	}
	showTaxId(){
		this.ownershipForm.controls['tax_id'].setValidators([Validators.required]);
		// this.leaseForm.get('tax_id').setValidators([Validators.required]);
		this.ownershipForm.controls['tax_id'].updateValueAndValidity();
		console.log(this.TaxId);
		console.log(this.ownershipForm.get('tax_id'));
	}

	getComponentTitle() {
		let result = 'Edit Ownership Contract';

		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
