import {Component, OnDestroy, OnInit, AfterViewChecked} from '@angular/core';
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
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../core/_base/crud';
import {CustomerModel} from "../../../../core/customer/customer.model";
import {
	selectLastCreatedCustomerId,
	selectCustomerActionLoading,
	selectCustomerById
} from "../../../../core/customer/customer.selector";
import {CustomerOnServerCreated, CustomerUpdated} from "../../../../core/customer/customer.action";
import {ProvinceModel} from '../../../../core/state/province.model';
import {RegencyModel} from '../../../../core/state/regency.model';
import {DistrictModel} from '../../../../core/state/district.model';
import {VillageModel} from '../../../../core/state/village.model';
import {StateService} from '../../../../core/state/state.service';
import {CustomerService} from '../../../../core/customer/customer.service';

@Component({
  selector: 'kt-add-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit, OnDestroy, AfterViewChecked{
	// Public properties
	customer: CustomerModel;
	customerId$: Observable<string>;
	oldCustomer: CustomerModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	customerForm: FormGroup;
	hasFormErrors = false;
	codenum: any = null;
	provinceResult: any[] = [];
	regencyResult: any[] = [];
	districtResult: any[] = [];
	villageResult: any[] = [];
	postalcodeResult: any[] = [];
	propinsi: string;
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private customerFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private stateService: StateService,
		private customerService: CustomerService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService
	) {

	}
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectCustomerActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectCustomerById(id))).subscribe(res => {
					if (res) {
						this.customer = res;
						this.oldCustomer = Object.assign({}, this.customer);
						this.initCustomer();
						// this.propinsi = res.idvllg.district.regency.province.code;
					}
				});
			} else {
				this.customer = new CustomerModel();
				this.customer.clear();
				this.initCustomer();
			}
		});
		this.subscriptions.push(routeSubscription);
		this.loadProvince();
		this.loadRegency(this.customer.idvllg.district.regency.province.code)
		this.loadDistrict(this.customer.idvllg.district.regency.code)
		this.loadVillage(this.customer.idvllg.district.code)
		this.loadPostalcode(this.customer.idvllg.district.name)

	}
	initCustomer(){
		this.createForm();
	}
	createForm() {
			this.customerForm = this.customerFB.group({
				cstrmrcd: [{"value":this.customer.cstrmrcd, "disabled":true}, Validators.required],
				cstrmrpid: [this.customer.cstrmrpid, Validators.required],
				npwp: [this.customer.npwp, Validators.required],
				cstrmrnm: [this.customer.cstrmrnm, Validators.required],
				addrcstmr: [this.customer.addrcstmr, Validators.required],
				gndcstmr: [this.customer.gndcstmr, Validators.required],
				phncstmr: [this.customer.phncstmr, Validators.required],
				emailcstmr: [this.customer.emailcstmr, Validators.required],
				idvllg: [this.customer.idvllg._id, Validators.required],
				district: [this.customer.idvllg.district.code, Validators.required],
				regency: [this.customer.idvllg.district.regency.code, Validators.required],
				province: [this.customer.idvllg.district.regency.province.code],
				postcode: [this.customer.postcode],
				// type: [this.customer.type],
				bankname: [this.customer.bankname],
				bankaccnt: [this.customer.bankaccnt],
			});
	}

	getNumber() {
		this.customerService.generateCustomerCode().subscribe(
			res => {
				this.codenum = res.data
			}
		)
	}
	loadProvince(){
		const queryParams = new QueryParamsModel(null,
			"asc",
			"grpnm",
			1,
			10);
		this.stateService.getListProvince(queryParams).subscribe(
			res => {
				this.provinceResult = res.data;
			}
		);
	}

	loadDistrict(regencyCode: string){
		const queryParams = new QueryParamsModel(null,
			"asc",
			"grpnm",
			1,
			10);
		this.stateService.getListDistrictByParent(queryParams, regencyCode).subscribe(
			res => {
				this.districtResult = res.data;
			}
		);
	}
	loadRegency(provCode){
		const queryParams = new QueryParamsModel(null,
			"asc",
			"grpnm",
			1,
			10);
		this.stateService.getListRegencyByParent(queryParams, provCode).subscribe(
			res => {
				this.regencyResult = res.data;
			}
		);
	}
	
	loadVillage(districtCode: string){
		const queryParams = new QueryParamsModel(null,
			"asc",
			"grpnm",
			1,
			10);
		this.stateService.getListVillageByParent(queryParams, districtCode).subscribe(
			res => {
				this.villageResult = res.data;
			}
		);
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
	provinceOnChange(item){
		if(item){
			this.customerForm.controls.regency.enable();
			this.loadRegency(item);
		}
	}
	regencyOnChange(item){
		if(item){
			this.customerForm.controls.district.enable();
			this.loadDistrict(item);
		}
	}

	districtOnChange(item){
		if(item){
			console.log(name);
			this.customerForm.controls.idvllg.enable();
			this.customerForm.controls.postcode.enable();
			this.loadVillage(item);
			this.districtResult.forEach((postalitem)=>{
				console.log(item);
				if( postalitem.code == item){
					this.loadPostalcode(postalitem.name);
					console.log(postalitem.name)
				}
			});
		}
	}
	goBackWithId() {
		const url = `/customer`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshCustomer(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/customer/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.customer = Object.assign({}, this.oldCustomer);
		this.createForm();
		this.hasFormErrors = false;
		this.customerForm.markAsPristine();
		this.customerForm.markAsUntouched();
		this.customerForm.updateValueAndValidity();
	}
	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.customerForm.controls;
		/** check form */
		if (this.customerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedCustomer = this.prepareCustomer();
		this.updateCustomer(editedCustomer, withBack);

	}
	prepareCustomer(): CustomerModel {
		const controls = this.customerForm.controls;
		const _customer = new CustomerModel();
		_customer.clear();
		_customer._id = this.customer._id;
		_customer.cstrmrcd = controls.cstrmrcd.value;
		_customer.cstrmrpid = controls.cstrmrpid.value;
		_customer.npwp = controls.npwp.value;
		_customer.cstrmrnm = controls.cstrmrnm.value.toLowerCase();
		_customer.gndcstmr = controls.gndcstmr.value.toLowerCase();
		_customer.phncstmr = controls.phncstmr.value;
		_customer.addrcstmr = controls.addrcstmr.value.toLowerCase();
		_customer.emailcstmr = controls.emailcstmr.value;
		_customer.idvllg = controls.idvllg.value;
		_customer.postcode = controls.postcode.value;
		// _customer.type = controls.type.value;
		_customer.bankname = controls.bankname.value.toLowerCase();
		_customer.bankaccnt = controls.bankaccnt.value;
		return _customer;
	}

	updateCustomer(_customer: CustomerModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const editSubscription = this.customerService.updateCustomer(_customer).subscribe(
			res => {
				const message = `Tenant successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshCustomer(false);
					const url = `/customer`;
					this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
				}
			},
			err => {
				console.error(err);
				const message = 'Error while editing tenant | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(editSubscription);
	}
	getComponentTitle() {
		let result = `Edit Tenant`;
		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngAfterViewChecked(){
		if (!this.customer._id) {
			this.getNumber();
			const controls = this.customerForm.controls;
			controls.cstrmrcd.setValue(this.codenum);
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
