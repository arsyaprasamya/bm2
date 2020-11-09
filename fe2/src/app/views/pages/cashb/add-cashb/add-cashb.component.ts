import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import {CashbModel} from "../../../../core/cashb/cashb.model";
import {
	selectLastCreatedCashbId,
	selectCashbActionLoading,
	selectCashbById
} from "../../../../core/cashb/cashb.selector";
import {CashbService} from '../../../../core/cashb/cashb.service';

@Component({
  selector: 'kt-add-cashb',
  templateUrl: './add-cashb.component.html',
  styleUrls: ['./add-cashb.component.scss']
})
export class AddCashBankComponent implements OnInit, OnDestroy {
	// Public properties
	cashb: CashbModel;
	CashbId$: Observable<string>;
	oldCashb: CashbModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	cashbForm: FormGroup;
	hasFormErrors = false;
	date1 = new FormControl(new Date());
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cashbFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: CashbService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectCashbActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectCashbById(id))).subscribe(res => {
					if (res) {
						this.cashb = res;
						this.oldCashb = Object.assign({}, this.cashb);
						this.initCashb();
					}
				});
			} else {
				this.cashb = new CashbModel();
				this.cashb.clear();
				this.initCashb();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initCashb() {
		this.createForm();
	}

	createForm() {
		if (this.cashb._id){
			this.cashbForm = this.cashbFB.group({
				paidfrom: [this.cashb.paidfrom],
				voucherno: [this.cashb.voucherno],
				memo: [this.cashb.memo],
				payee: [this.cashb.payee],
				chequeno : [this.cashb.chequeno],
				date : [this.date1.value],
				pymnttype : [this.cashb.pymnttype],
				amount  :[this.cashb.amount]
			});
		}else {
			this.cashbForm = this.cashbFB.group({
				paidfrom: [""],
				voucherno: [""],
				memo: [""],
				payee: [""],
				chequeno : [""],
				date : [this.date1.value],
				pymnttype : [""],
				amount  :[""]
			});
		}
		
	}

	goBackWithId() {
		const url = `/cashb`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshCashb(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/cashb/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.cashb = Object.assign({}, this.oldCashb);
		this.createForm();
		this.hasFormErrors = false;
		this.cashbForm.markAsPristine();
		this.cashbForm.markAsUntouched();
		this.cashbForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.cashbForm.controls;
		/** check form */
		if (this.cashbForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedCashb = this.prepareCashb();

		if (editedCashb._id) {
			this.updateCashb(editedCashb, withBack);
			return;
		}

		this.addCashb(editedCashb, withBack);
	}
	prepareCashb(): CashbModel {
		const controls = this.cashbForm.controls;
		const _cashb = new CashbModel();
		_cashb.clear();
		_cashb._id = this.cashb._id;
		_cashb.paidfrom = controls.paidfrom.value;
		_cashb.voucherno= controls.voucherno.value.toLowerCase();
		_cashb.memo= controls.memo.value;
		_cashb.payee= controls.payee.value;
		_cashb.chequeno = controls.chequeno.value;
		_cashb.date = controls.date.value;
		_cashb.pymnttype =  controls.pymnttype.value;
		_cashb.amount  = controls.amount.value;
		return _cashb;
	}

	addCashb( _cashb: CashbModel, withBack: boolean = false) {
		const addSubscription = this.service.createCashb(_cashb).subscribe(
			res => {
				const message = `New Cashb successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/cashb`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding unit type | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateCashb(_cashb: CashbModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateCashb(_cashb).subscribe(
			res => {
				const message = `Cash Bank successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/cashb`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding cash bank | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Cash Bank';
		if (!this.cashb || !this.cashb._id) {
			return result;
		}

		result = `Edit Cash Bank`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
