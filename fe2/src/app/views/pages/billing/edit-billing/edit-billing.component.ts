// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../core/_base/crud';
import {
	selectLastCreatedBillingId,
	selectBillingActionLoading,
	selectBillingById
} from "../../../../core/billing/billing.selector";
import {BillingOnServerCreated, BillingUpdated} from "../../../../core/billing/billing.action";
import {BillingModel} from '../../../../core/billing/billing.model';
import {BillingService} from '../../../../core/billing/billing.service';
import {SelectionModel} from "@angular/cdk/collections";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepicker} from '@angular/material';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {CustomerService} from '../../../../core/customer/customer.service';
import {UnitService} from '../../../../core/unit/unit.service';
import {QueryUnitModel} from '../../../../core/unit/queryunit.model';
import {PowerTransactionService} from '../../../../core/power/transaction/transaction.service';
import {WaterTransactionService} from '../../../../core/water/transaction/transaction.service';
const moment = _rollupMoment || _moment;


@Component({
  selector: 'kt-add-billing',
  templateUrl: './edit-billing.component.html',
  styleUrls: ['./edit-billing.component.scss']
})
export class EditBillingComponent implements OnInit, OnDestroy {
	invoicenumber: any;
	billing: BillingModel;
	billingId$: Observable<string>;
	oldBilling: BillingModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	billingForm: FormGroup;
	hasFormErrors = false;
	unitResult: any[] = [];
	customerResult: any[] = [];
	powerResult: any[] = [];
	waterResult: any[] = [];
	selection = new SelectionModel<BillingModel>(true, []);
	date = new FormControl(moment());
	date1 = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	duedate = new FormControl();
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private billingFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private serviceBill: BillingService,
		private serviceCustomer: CustomerService,
		private serviceUnit: UnitService,
		private layoutConfigService: LayoutConfigService,
		private powerservice : PowerTransactionService,
		private waterservice : WaterTransactionService
	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectBillingActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectBillingById(id))).subscribe(res => {
					if (res) {
						this.billing = res;
						this.oldBilling = Object.assign({}, this.billing);
						this.initBilling();
					}
				});
			} else {
				this.billing = new BillingModel();
				this.billing.clear();
				this.initBilling();
			}
		});
		this.subscriptions.push(routeSubscription);
	}
	initBilling() {
		this.createForm();
		this.loadUnit();
		this.loadCustomer(this.billing.unit._id);
		this.unitOnChange(this.billing.unit._id);
	}

	loadUnit(){
		this.selection.clear();
		const queryParams = new QueryUnitModel(
			null,
			"asc",
			"grpnm",
			1,
			10
		);
		this.serviceUnit.getListUnit(queryParams).subscribe(
			res => {
				this.unitResult = res.data;
			}
		);
	}
	createForm() {
			this.billingForm = this.billingFB.group({
				billed_to: [this.billing.billed_to, Validators.required],
				unit: [this.billing.unit._id, Validators.required],
				contract_number: [{value: this.billing.billing_number, disabled: true}, Validators.required],
				created_date: [{"value":this.billing.created_date, "disabled": true}, Validators.required],
				billing_date: [this.billing.billing_date],
				due_date: [this.billing.due_date],
				billing: this.billingFB.group({
					service_charge: this.billingFB.group({
						amount: this.billing.billing.amount,
					}),
					sinkingfund: this.billingFB.group({
						amountsink: this.billing.billing.amount,
					}),
					electricity: this.billingFB.group({
						electric_trans: this.billing.billing.electricity.electric_trans,
					}),
					water: this.billingFB.group({
						water_trans: this.billing.billing.water.water_trans,
					})
				})
			});
	}

	unitOnChange(item){
		if(item){
			this.loadCustomer(item);
			this.loadPower(item);
			this.loadWater(item);
		}
		const controls = this.billingForm.controls;
		this.serviceUnit.getUnitById(item).subscribe(data => {
			// controls.billing.get('service_charge')['controls'].amount.setValue(data.data.srvcrate);
			const dt:any = data.data;
			controls.billing.get('service_charge')['controls'].amount.setValue(dt.srvcrate);
			controls.billing.get('sinkingfund')['controls'].amountsink.setValue(dt.sinkingfund);
			// console.log(controls.billing.controls.service_charge.controls.amount)
		});
	}

	loadCustomer(unitid){
		this.serviceUnit.getCustomerUnit(unitid).subscribe(
			res => {
				this.customerResult = res.data;
			}
		);
	}
	loadPower(unitid){
		this.powerservice.getPowerTransactionUnit(unitid).subscribe(
			res => {
				this.powerResult = res.data;
			}
		);
	}

	loadWater(unitid){
		this.waterservice.getWaterTransactionUnit(unitid).subscribe(
			res => {
				this.waterResult = res.data;
			}
		);
	}



	goBackWithId() {
		const url = `/billing`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	refreshBilling(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/billing/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.billingForm.controls;
		/** check form */
		if (this.billingForm.invalid) {
			console.log(controls);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedBilling = this.prepareBilling();
		this.updateBilling(editedBilling, withBack);
	}
	
	prepareBilling(): BillingModel {
		const controls = this.billingForm.controls;
		const _billing = new BillingModel();
		//console.log(controls.billing.get('service_charge')['controls'].amount.value);
		_billing.clear();
		_billing._id = this.billing._id;
		_billing.billed_to = controls.billed_to.value.toLowerCase();
		_billing.unit = controls.unit.value.toLowerCase();
		_billing.billing_number = controls.contract_number.value;
		_billing.created_date = controls.created_date.value;
		_billing.billing_date = controls.billing_date.value;
		_billing.due_date = controls.due_date.value;
		_billing.billing = {
			service_charge: {
				amount: controls.billing.get('service_charge')['controls'].amount.value
			},
			sinkingfund: {
				amountsink: controls.billing.get('sinkingfund')['controls'].amountsink.value
			},
			electricity: {
				electric_trans: controls.billing.get('electricity')['controls'].electric_trans.value
			},
			water: {
				water_trans: controls.billing.get('water')['controls'].water_trans.value
			},
		};
		return _billing;
	}
	
	updateBilling(_billing: BillingModel, withBack: boolean = false){
		const editSubscription = this.serviceBill.updateBilling(_billing).subscribe(
			res => {
				const message = `Billing successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/billing`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while saving billing | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(editSubscription);
	}
	getComponentTitle() {
		let result = `Edit Billing`;
		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	reset() {
		this.billing = Object.assign({}, this.oldBilling);
		this.createForm();
		this.hasFormErrors = false;
		this.billingForm.markAsPristine();
		this.billingForm.markAsUntouched();
		this.billingForm.updateValueAndValidity();
	}


	
	getBillingNumber(){
		this.serviceBill.getBillingNumber().subscribe(
			res => {
				const controls = this.billingForm.controls;
				controls.contract_number.setValue(res.data);
				controls.due_date.setValue(moment(this.date1.value, 'MM/DD/YYYY').add(30, 'day').toDate());
			}
		);
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		const controls = this.billingForm.controls;
		controls.due_date.setValue(moment(event.value, 'MM/DD/YYYY').add(30, 'day').toDate());
	}

}
