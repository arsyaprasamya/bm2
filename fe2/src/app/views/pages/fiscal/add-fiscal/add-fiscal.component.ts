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
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import {FiscalModel} from "../../../../core/fiscal/fiscal.model";
import {
	selectLastCreatedFiscalId,
	selectFiscalActionLoading,
	selectFiscalById
} from "../../../../core/fiscal/fiscal.selector";
import {FiscalService} from '../../../../core/fiscal/fiscal.service';

@Component({
  selector: 'kt-add-fiscal',
  templateUrl: './add-fiscal.component.html',
  styleUrls: ['./add-fiscal.component.scss']
})
export class AddFiscalComponent implements OnInit, OnDestroy {
	// Public properties
	fiscal: FiscalModel;
	FiscalId$: Observable<string>;
	oldFiscal: FiscalModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	fiscalForm: FormGroup;
	hasFormErrors = false;
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private fiscalFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: FiscalService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectFiscalActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectFiscalById(id))).subscribe(res => {
					if (res) {
						this.fiscal = res;
						this.oldFiscal = Object.assign({}, this.fiscal);
						this.initFiscal();
					}
				});
			} else {
				this.fiscal = new FiscalModel();
				this.fiscal.clear();
				this.initFiscal();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initFiscal() {
		this.createForm();
		this.perhitungan();
	}

	createForm() {
		this.fiscalForm = this.fiscalFB.group({
			fiscalName : [this.fiscal.fiscalName],
   			fiscalDepMethod : [this.fiscal.fiscalDepMethod, Validators.required],
   			fiscalLife : [this.fiscal.fiscalLife], //number
  			fiscalDepRate: [{value:this.fiscal.fiscalDepRate, disabled:true}], // number
		});
	}


	perhitungan(){
		const value = this.fiscalForm.controls.fiscalLife.value;
		const type = this.fiscalForm.controls.fiscalDepMethod.value;
		// if (type != "Straight Line Method" && type != "Double Declining Method" && value == 0 ){
		// 	this.fiscalForm.controls.fiscalDepRate.setValue(0)
		// }
		const dept  = this.fiscalForm.controls.fiscalDepRate.value;

		if (type == "Straight Line Method" && value != 0){
			this.fiscalForm.controls.fiscalDepRate.setValue(
				((100 / value)).toPrecision(4)
			);
		}else if (type == "Double Declining Method" && value != 0){
			this.fiscalForm.controls.fiscalDepRate.setValue(
				((200 / value)).toPrecision(4)
			);
		}
	}

	goBackWithId() {
		const url = `/fiscal`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshFiscal(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/fiscal/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.fiscal = Object.assign({}, this.oldFiscal);
		this.createForm();
		this.hasFormErrors = false;
		this.fiscalForm.markAsPristine();
		this.fiscalForm.markAsUntouched();
		this.fiscalForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.fiscalForm.controls;
		/** check form */
		if (this.fiscalForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedFiscal = this.prepareFiscal();

		if (editedFiscal._id) {
			this.updateFiscal(editedFiscal, withBack);
			return;
		}

		this.addFiscal(editedFiscal, withBack);
	}
	prepareFiscal(): FiscalModel {
		const controls = this.fiscalForm.controls;
		const _fiscal = new FiscalModel();
		_fiscal.clear();
		_fiscal._id = this.fiscal._id;
		_fiscal.fiscalName = controls.fiscalName.value;
		_fiscal.fiscalDepMethod = controls.fiscalDepMethod.value;
		_fiscal.fiscalLife = controls.fiscalLife.value;
		_fiscal.fiscalDepRate = controls.fiscalDepRate.value;
		return _fiscal;
	}

	addFiscal( _fiscal: FiscalModel, withBack: boolean = false) {
		const addSubscription = this.service.createFiscal(_fiscal).subscribe(
			res => {
				const message = `New Fiscal successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/fiscal`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding fiscal | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateFiscal(_fiscal: FiscalModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateFiscal(_fiscal).subscribe(
			res => {
				const message = `Fiscal successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/fiscal`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding fiscal | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Fiscal Asset';
		if (!this.fiscal || !this.fiscal._id) {
			return result;
		}

		result = `Edit Fiscal Asset`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
