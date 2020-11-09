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
import {FixedModel} from "../../../../core/fixed/fixed.model";
import {
	selectLastCreatedFixedId,
	selectFixedActionLoading,
	selectFixedById
} from "../../../../core/fixed/fixed.selector";
import {FixedService} from '../../../../core/fixed/fixed.service';
import { SelectionModel } from '@angular/cdk/collections';
import { QueryFiscalModel } from '../../../../core/fiscal/queryfiscal.model';
import { FiscalService } from '../../../../core/fiscal/fiscal.service';

@Component({
  selector: 'kt-add-fixed',
  templateUrl: './add-fixed.component.html',
  styleUrls: ['./add-fixed.component.scss']
})
export class AddFixedComponent implements OnInit, OnDestroy {
	// Public properties
	fixed: FixedModel;
	FixedId$: Observable<string>;
	oldFixed: FixedModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	selection = new SelectionModel<FixedModel>(true, []);
	fixedForm: FormGroup;
	hasFormErrors = false;
	fResult: any[] = [];
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private fixedFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: FixedService,
		private fservice: FiscalService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectFixedActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectFixedById(id))).subscribe(res => {
					if (res) {
						this.fixed = res;
						this.oldFixed = Object.assign({}, this.fixed);
						this.initFixed();
					}
				});
			} else {
				this.fixed = new FixedModel();
				this.fixed.clear();
				this.initFixed();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initFixed() {
		this.createForm();
		this.loadFiscalAsset();
	}

	createForm() {
		if(this.fixed._id){
		this.fixedForm = this.fixedFB.group({
			fixedAssetTypeName : [this.fixed.fixedAssetTypeName],
			fiscalFixedType : [this.fixed.fiscalFixedType._id],
		});
		}else{
			this.fixedForm = this.fixedFB.group({
				fixedAssetTypeName : [""],
				fiscalFixedType : [""],
			});
		}
	}

	loadFiscalAsset(){
		this.selection.clear();
		const queryParams = new QueryFiscalModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.fservice.getListFiscal(queryParams).subscribe(
			res => {
				this.fResult = res.data;	
			}
		);
	}

	goBackWithId() {
		const url = `/fixed`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshFixed(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/fixed/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.fixed = Object.assign({}, this.oldFixed);
		this.createForm();
		this.hasFormErrors = false;
		this.fixedForm.markAsPristine();
		this.fixedForm.markAsUntouched();
		this.fixedForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.fixedForm.controls;
		/** check form */
		if (this.fixedForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedFixed = this.prepareFixed();

		if (editedFixed._id) {
			this.updateFixed(editedFixed, withBack);
			return;
		}

		this.addFixed(editedFixed, withBack);
	}
	prepareFixed(): FixedModel {
		const controls = this.fixedForm.controls;
		const _fixed = new FixedModel();
		_fixed.clear();
		_fixed._id = this.fixed._id;
		_fixed.fixedAssetTypeName = controls.fixedAssetTypeName.value;
		_fixed.fiscalFixedType = controls.fiscalFixedType.value;
		return _fixed;
	}

	addFixed( _fixed: FixedModel, withBack: boolean = false) {
		const addSubscription = this.service.createFixed(_fixed).subscribe(
			res => {
				const message = `New Fixed successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/fixed`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding fixed | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateFixed(_fixed: FixedModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateFixed(_fixed).subscribe(
			res => {
				const message = `Fixed successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/fixed`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding fixed | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Fixed Asset';
		if (!this.fixed || !this.fixed._id) {
			return result;
		}

		result = `Edit Fixed Asset`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
