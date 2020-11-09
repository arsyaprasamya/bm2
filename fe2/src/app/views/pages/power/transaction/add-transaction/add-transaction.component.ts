// Angular
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import {
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
// NGRX
import { Store, select } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { AppState } from "../../../../../core/reducers";
// Layout
import {
	SubheaderService,
	LayoutConfigService,
} from "../../../../../core/_base/layout";
import {
	LayoutUtilsService,
	MessageType,
	QueryParamsModel,
} from "../../../../../core/_base/crud";
import {
	selectLastCreatedPowerTransactionId,
	selectPowerTransactionActionLoading,
	selectPowerTransactionById,
} from "../../../../../core/power/transaction/transaction.selector";
import {
	PowerTransactionOnServerCreated,
	PowerTransactionUpdated,
} from "../../../../../core/power/transaction/transaction.action";
import { PowerTransactionModel } from "../../../../../core/power/transaction/transaction.model";
import { PowerMeterService } from "../../../../../core/power/meter/meter.service";
import { SelectionModel } from "@angular/cdk/collections";
import { QueryPowerMeterModel } from "../../../../../core/power/meter/querymeter.model";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	MatDatepicker,
} from "@angular/material";
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
const moment = _rollupMoment || _moment;

@Component({
	selector: "kt-add-transaction",
	templateUrl: "./add-transaction.component.html",
	styleUrls: ["./add-transaction.component.scss"],
})
export class AddTransactionComponent implements OnInit, OnDestroy {
	powerTransaction: PowerTransactionModel;
	powerTransactionId$: Observable<string>;
	oldPowerTransaction: PowerTransactionModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	powerTransactionForm: FormGroup;
	hasFormErrors = false;
	powerTransactionResult: any[] = [];
	powerMeter: any[] = [];
	date = new FormControl(moment());
	date1 = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	duedate = new FormControl();
	selection = new SelectionModel<PowerTransactionModel>(true, []);
	checker : boolean;
	buttonSave : boolean = true;
	
	
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private powerTransactionFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private servicePowerMeter: PowerMeterService,
		private layoutConfigService: LayoutConfigService
	) {}

	ngOnInit() {
		this.loading$ = this.store.pipe(
			select(selectPowerTransactionActionLoading)
		);
		const routeSubscription = this.activatedRoute.params.subscribe(
			(params) => {
				const id = params.id;
				if (id) {
					this.store
						.pipe(select(selectPowerTransactionById(id)))
						.subscribe((res) => {
							if (res) {
								this.powerTransaction = res;
								this.checker = res.checker;
								this.oldPowerTransaction = Object.assign(
									{},
									this.powerTransaction
								);
								this.initPowerTransaction();
							}
						});
				} else {
					this.powerTransaction = new PowerTransactionModel();
					this.powerTransaction.clear();
					this.initPowerTransaction();
				}
			}
		);
		this.subscriptions.push(routeSubscription);
	}
	initPowerTransaction() {
		this.createForm();
		this.hiddenAfterRes()
		
	}

	
	hiddenAfterRes(){
		if (this.powerTransaction._id){
			if (this.powerTransaction.checker != false){
				this.buttonSave = true;
			}else{
				this.buttonSave = false;
			}
		}else{
			this.buttonSave = false;
		}
	}


	createForm() {
		if (this.powerTransaction._id) {
			if (this.powerTransaction.checker != false){
			this.loadMeterList();
			this.powerTransactionForm = this.powerTransactionFB.group({
				pow: [{"value":this.powerTransaction.pow._id, disabled:true }],
				loss: [{"value":this.powerTransaction.loss, disabled:true}],
				rate: [
					{
						value: this.powerTransaction.pow.rte.rte,
						disabled: true,
					},
				],
				strtpos: [{"value":this.powerTransaction.strtpos,"disabled":true}],
				endpos: [{"value":this.powerTransaction.endpos, disabled:true}],
				strtpos2: [{"value":this.powerTransaction.strtpos2,"disabled":true}],
				endpos2: [{"value":this.powerTransaction.endpos2,"disabled":true}],
				billmnt: [{"value":this.powerTransaction.billmnt, disabled:true }],
				billamn: [
					{ value: this.powerTransaction.billamnt, disabled: true },
					Validators.required,
				],
				lossres: [this.powerTransaction.lossres],
				checker:[this.powerTransaction.checker]
			});
			}else{
			this.loadMeterList();
			this.powerTransactionForm = this.powerTransactionFB.group({
				pow: [{"value":this.powerTransaction.pow._id, disabled:true }],
				loss: [{"value":this.powerTransaction.loss, disabled:true}],
				rate: [
					{
						value: this.powerTransaction.pow.rte.rte,
						disabled: true,
					},
				],
				strtpos: [{"value":this.powerTransaction.strtpos,"disabled":true}, Validators.required],
				endpos: [this.powerTransaction.endpos, Validators.required],
				strtpos2: [{"value":this.powerTransaction.strtpos2,"disabled":true}],
				endpos2: [{"value":this.powerTransaction.endpos2,"disabled":true}],
				billmnt: [this.powerTransaction.billmnt, Validators.required],
				billamn: [
					{ value: this.powerTransaction.billamnt, disabled: true },
					Validators.required,
				],
				lossres: [this.powerTransaction.lossres],
				checker:[this.powerTransaction.checker],
				powname : [this.powerTransaction.powname],
			});

			}
		} else {
			this.loadMeterList();
			this.powerTransactionForm = this.powerTransactionFB.group({
				pow: ["", Validators.required],
				rate: [{ value: "", disabled: true }, Validators.required],
				strtpos: ["", Validators.required],
				endpos: ["", Validators.required],
				strtpos2: [{value:"", disabled:true}],
				endpos2: [{value:"", disabled:true}],
				billmnt: [{value: this.date1.value, disabled: false}, Validators.required],
				billamn: [{ value: "", disabled: true }, Validators.required],
				loss: [""],
				lossres:[""],
				checker:[""],
				powname:[""],
			});
		}
	}
	goBackWithId() {
		const url = `/power-management/power/transaction`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	refreshPowerTransaction(isNew: boolean = false, id: string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/power-management/power/transaction/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.powerTransactionForm.controls;
		/** check form */
		if (this.powerTransactionForm.invalid) {
			console.log(controls);
			Object.keys(controls).forEach((controlName) =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedPowerTransaction = this.preparePowerTransaction();

		if (editedPowerTransaction._id) {
			this.updatePowerTransaction(editedPowerTransaction, withBack);
			return;
		}

		this.addPowerTransaction(editedPowerTransaction, withBack);
	}
	preparePowerTransaction(): PowerTransactionModel {
		const controls = this.powerTransactionForm.controls;
		const _powerTransaction = new PowerTransactionModel();
		_powerTransaction.clear();
		_powerTransaction._id = this.powerTransaction._id;
		_powerTransaction.pow = controls.pow.value;
		_powerTransaction.strtpos = controls.strtpos.value;
		_powerTransaction.endpos = controls.endpos.value;
		_powerTransaction.strtpos2 = controls.strtpos2.value;
		_powerTransaction.endpos2 = controls.endpos2.value;
		_powerTransaction.billmnt = controls.billmnt.value;
		_powerTransaction.billamnt = controls.billamn.value;
		_powerTransaction.loss = controls.loss.value;
		_powerTransaction.lossres = controls.lossres.value;
		_powerTransaction.checker = controls.checker.value;
		_powerTransaction.powname = controls.powname.value.toLowerCase();
		return _powerTransaction;
	}
	addPowerTransaction(_powerTransaction: PowerTransactionModel,withBack: boolean = false) {
		this.store.dispatch(new PowerTransactionOnServerCreated({powertransaction: _powerTransaction,})
		);
		const addSubscription = this.store
			.pipe(select(selectLastCreatedPowerTransactionId))
			.subscribe((newId) => {
				const message = `New electricity consumption successfully has been added.`;
				this.layoutUtilsService.showActionNotification(
					message,
					MessageType.Create,
					5000,
					true,
					
				);
				
				if (_powerTransaction.checker != true){
					const url = `/power-management/power/transaction/new`;
					this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
					}else{
					const url2 = `/power-management/power/transaction`;
					this.router.navigateByUrl(url2, { relativeTo: this.activatedRoute });
				}
				if (newId) {
					if (withBack) {
						this.goBackWithId();
						
					} else {
						this.refreshPowerTransaction(true, newId);
					}
				}
			});
		this.subscriptions.push(addSubscription);
	}
	
	updatePowerTransaction(
		_powerTransaction: PowerTransactionModel,
		withBack: boolean = false
	) {
		const updatedPowerTransaction: Update<PowerTransactionModel> = {
			id: _powerTransaction._id,
			changes: _powerTransaction,
		};
		this.store.dispatch(
			new PowerTransactionUpdated({
				partialPowerTransaction: updatedPowerTransaction,
				powertransaction: _powerTransaction,
			})
		);
		const message = `Power consumption successfully has been saved.`;
		this.layoutUtilsService.showActionNotification(
			message,
			MessageType.Update,
			5000,
			true,
			
		);
		if (withBack) {
			this.goBackWithId();
			
		} else {
			this.refreshPowerTransaction(false);
			const url = `/power-management/power/transaction`;
			this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			
		}
	}

	getComponentTitle() {
		let result = "Create Electricity Consumption ";
		if (!this.powerTransaction || !this.powerTransaction._id) {
			return result;
		}

		result = `Edit Electricity Consumption`;
		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	reset() {
		this.powerTransaction = Object.assign({}, this.oldPowerTransaction);
		this.createForm();
		this.hasFormErrors = false;
		this.powerTransactionForm.markAsPristine();
		this.powerTransactionForm.markAsUntouched();
		this.powerTransactionForm.updateValueAndValidity();
	}
	loadMeterList() {
		this.selection.clear();
		const queryParams = new QueryPowerMeterModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.servicePowerMeter.getListPowerMeter(queryParams).subscribe((res) => {
				this.powerMeter = res.data;
			});
	}

	changePowerMeter(item) {
		this.servicePowerMeter.getPowerMeter(item).subscribe((res) => {
			console.log(item)
			this.powerTransactionForm.controls.rate.setValue(res.data.rte.rte);
			this.powerTransactionForm.controls.powname.setValue(res.data.nmmtr);
			this.powerTransactionForm.controls.strtpos.setValue(res.lastConsumtion.endpos);
			console.log(res)
			const strtpos = this.powerTransactionForm.controls.strtpos.value / 10;
			if (strtpos !== 0){
				this.powerTransactionForm.controls.strtpos2.setValue(
					strtpos);
			}
		});
	}
	

	
	// changeMeterPost() {
	// 	const strtpos = this.powerTransactionForm.controls.strtpos.value;
	// 	const endpos = this.powerTransactionForm.controls.endpos.value;
	// 	const rate = this.powerTransactionForm.controls.rate.value;
	// 	if (strtpos !== "" && endpos !== "" && rate !== "") {
	// 		this.powerTransactionForm.controls.billamn.setValue(
	// 			(endpos - strtpos) * rate
	// 		);
	// 	}
	// }
	
	changeMeterPost() {
		const strtpos = this.powerTransactionForm.controls.strtpos.value / 10; 
		if (strtpos !== 0){
			this.powerTransactionForm.controls.strtpos2.setValue(
				strtpos);
		}
		const endpos = this.powerTransactionForm.controls.endpos.value / 10;
		if (endpos !== 0){
			this.powerTransactionForm.controls.endpos2.setValue(
				endpos);
		}
		const rate = this.powerTransactionForm.controls.rate.value;
		if (endpos !== 0 && rate !== 0 ) {
			this.powerTransactionForm.controls.billamn.setValue(
				Math.fround((endpos - strtpos) * rate).toFixed(2));
		}
	}

	changePowerLoss() {
		const billamn = this.powerTransactionForm.controls.billamn.value;
		const loss = this.powerTransactionForm.controls.loss.value;
		if (billamn !== 0 && loss !== 0) {
			this.powerTransactionForm.controls.lossres.setValue(
				Math.fround(billamn * loss).toFixed(2)
			);
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
}
