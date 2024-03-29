import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

import {
	selectLastCreatedAdId,
	selectAdActionLoading,
	selectAdById
} from "../../../../../core/asset/assetDepreciation/ad.selector";

import { AdModel } from '../../../../../core/asset/assetDepreciation/ad.model';
import { AdService } from '../../../../../core/asset/assetDepreciation/ad.service';
import { QueryRentalModel } from '../../../../../core/rental/queryrental.model';
import { SelectionModel } from '@angular/cdk/collections';
import { RentalService } from '../../../../../core/rental/rental.service';
import { FixedService } from '../../../../../core/fixed/fixed.service';
import { QueryFixedModel } from '../../../../../core/fixed/queryfixed.model';
import { AmService } from '../../../../../core/asset/assetManagement/am.service';
import { QueryAmModel } from '../../../../../core/asset/assetManagement/queryam.model';
import { AccountGroupService } from '../../../../../core/accountGroup/accountGroup.service';
import { QueryAccountGroupModel } from '../../../../../core/accountGroup/queryag.model';

@Component({
  selector: 'kt-add-ad',
  templateUrl: './add-ad.component.html',
  styleUrls: ['./add-ad.component.scss']
})
export class AddAdComponent implements OnInit, OnDestroy {
	// Public properties
	ad: AdModel;
	AdId$: Observable<string>;
	oldAd: AdModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	adForm: FormGroup;
	hasFormErrors = false;
	amResult: any [] = [];
	acResult: any [] = [];
	adaResult: any [] = [];
	exResult : any [] = [];
	deaResult: any [] = [];	// Private properties
	selection = new SelectionModel<AdModel>(true, []);
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private adFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: AdService,
		private amService : AmService,
		private acService : AccountGroupService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectAdActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(parads => {
			const id = parads.id;
			if (id) {
				this.store.pipe(select(selectAdById(id))).subscribe(res => {
					if (res) {
						this.ad = res;
						this.oldAd = Object.assign({}, this.ad);
						this.initAd();
					}
				});
			} else {
				this.ad = new AdModel();
				this.ad.clear();
				this.initAd();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initAd() {
		this.createForm();
		this.loadAssetManagement();
		this.loadAda();
		this.loadAc();
		this.loadDea();
		this.loadEx();
		this.perhitungan()
	}

	createForm() {
	if 	(this.ad._id){
			this.loadAssetManagement();
			this.loadAda();
			this.loadAc();
			this.loadDea();
			this.loadEx();
				this.adForm = this.adFB.group({
				assetManagement: [this.ad.assetManagement._id], //model
				aquicitionDate: [this.ad.aquicitionDate], //string
				accumulatedDepAcct: [this.ad.accumulatedDepAcct._id], //model
				assetAccount: [this.ad.assetAccount._id], //model
				depreciationExpAcct: [this.ad.depreciationExpAcct._id], //mode
				expenditures : [this.ad.expenditures._id],
				depMethod : [this.ad.depMethod],
				life : [this.ad.life],
				depRate : [{value:this.ad.depRate, disabled:true}],
				intangibleAsset: [this.ad.intangibleAsset], //boolean
				fiscalFixedAsset: [this.ad.fiscalFixedAsset], //boolean
				remarks: [this.ad.remarks], //string
				codeAsset : [{value:this.ad.assetManagement.assetCode, disabled:true}],
				price : [{value:this.ad.assetManagement.purchasePrice, disabled:true}],
			});
		}else {
			this.adForm = this.adFB.group({
				assetManagement: [this.ad.assetManagement], //model
				aquicitionDate: [this.ad.aquicitionDate], //string
				accumulatedDepAcct: [this.ad.accumulatedDepAcct], //model
				assetAccount: [this.ad.assetAccount], //model
				depreciationExpAcct: [this.ad.depreciationExpAcct], //model
				intangibleAsset: [this.ad.intangibleAsset], //boolean
				expenditures : [this.ad.expenditures],
				depMethod : [this.ad.depMethod],
				life : [this.ad.life],
				depRate : [{value:this.ad.depRate, disabled:true}],
				fiscalFixedAsset: [this.ad.fiscalFixedAsset], //boolean
				remarks: [""],
				codeAsset : [{value:"", disabled:true}],
				price : [{value:"", disabled:true}], //string
			});
		}
	}

	perhitungan(){
		const value = this.adForm.controls.life.value;
		const type = this.adForm.controls.depMethod.value;
		// if (type != "Straight Line Method" && type != "Double Declining Method" && value == 0 ){
		// 	this.fiscalForm.controls.fiscalDepRate.setValue(0)
		// }

		if (type == "Straight Line Method" && value != 0){
			this.adForm.controls.depRate.setValue(
				((100 / value)).toPrecision(4)
			);
		}else if (type == "Double Declining Method" && value != 0){
			this.adForm.controls.depRate.setValue(
				((200 / value)).toPrecision(4)
			);
		}
	}

	loadAssetManagement(){
		this.selection.clear();
		const queryParams = new QueryAmModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.amService.getListAm(queryParams).subscribe(
			res => {
				this.amResult = res.data;
			}
		);
	}

	getamId(id) {
		const controls = this.adForm.controls;
		this.amService.findAmModelById(id).subscribe(
			data => {
				controls.remarks.setValue(data.data.description);
				controls.codeAsset.setValue(data.data.assetCode);
				controls.price.setValue(data.data.purchasePrice);
			}
		);
	}

	loadEx(){
		this.selection.clear();
		const queryParams = new QueryAccountGroupModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.acService.getListAccountGroup(queryParams).subscribe(
			res => {
				this.exResult = res.data;
			}
		);
	}

	loadAda(){
		this.selection.clear();
		const queryParams = new QueryAccountGroupModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.acService.getListAccountGroup(queryParams).subscribe(
			res => {
				this.adaResult = res.data;
			}
		);
	}

	loadAc(){
		this.selection.clear();
		const queryParams = new QueryAccountGroupModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.acService.getListAccountGroup(queryParams).subscribe(
			res => {
				this.acResult = res.data;
			}
		);
	}

	loadDea(){
		this.selection.clear();
		const queryParams = new QueryAccountGroupModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.acService.getListAccountGroup(queryParams).subscribe(
			res => {
				this.deaResult = res.data;
			}
		);
	}

	goBackWithId() {
		const url = `/ad`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshAd(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/ad/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.ad = Object.assign({}, this.oldAd);
		this.createForm();
		this.hasFormErrors = false;
		this.adForm.markAsPristine();
		this.adForm.markAsUntouched();
		this.adForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.adForm.controls;
		/** check form */
		if (this.adForm.invalid) {
			Object.keys(controls).forEach(controlNade =>
				controls[controlNade].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedAd = this.prepareAd();

		if (editedAd._id) {
			this.updateAd(editedAd, withBack);
			return;
		}

		this.addAd(editedAd, withBack);
	}
	prepareAd(): AdModel {
		const controls = this.adForm.controls;
		const _ad = new AdModel();
		_ad.clear();
		_ad._id = this.ad._id;
		_ad.assetManagement = controls.assetManagement.value;
		_ad.aquicitionDate = controls.aquicitionDate.value;
		_ad.assetAccount = controls.assetAccount.value;
		_ad.accumulatedDepAcct = controls.accumulatedDepAcct.value;
		_ad.depreciationExpAcct = controls.depreciationExpAcct.value;
		_ad.expenditures = controls.expenditures.value;
		_ad.intangibleAsset = controls.intangibleAsset.value;
		_ad.fiscalFixedAsset = controls.fiscalFixedAsset.value;
		_ad.remarks = controls.remarks.value;
		_ad.life = controls.life.value;
		_ad.depMethod = controls.depMethod.value;
		_ad.depRate = controls.depRate.value;
		return _ad;
	}

	
	addAd( _ad: AdModel, withBack: boolean = false) {
		const addSubscription = this.service.createAd(_ad).subscribe(
			res => {
				const message = `New asset depreciation successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/ad`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding asset depreciation | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateAd(_ad: AdModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateAd(_ad).subscribe(
			res => {
				const message = `Asset Depreciation successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/ad`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding asset depreciation | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Asset Depreciation';
		if (!this.ad || !this.ad._id) {
			return result;
		}

		result = `Edit Asset Depreciation`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	

	// changeQty() {
	// 	const qtySadple = this.adForm.controls.qtySadple.value;
	// 	const qtyGood = this.adForm.controls.qtyGood.value;
	// 	const qtyReject = this.adForm.controls.qtyReject.value;
	// 	if (qtySadple !== 0 && qtyGood !== 0 && qtyReject ) {
	// 		this.adForm.controls.qty.setValue(
	// 			(qtySadple + qtyGood + qtyReject )
	// 		);
	// 	}
	// }
}
