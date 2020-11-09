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
import {AccountGroupModel} from "../../../../core/accountGroup/accountGroup.model";
import {
	selectLastCreatedAccountGroupId,
	selectAccountGroupActionLoading,
	selectAccountGroupById
} from "../../../../core/accountGroup/accountGroup.selector";
import {AccountGroupService} from '../../../../core/accountGroup/accountGroup.service';
import { SelectionModel } from '@angular/cdk/collections';
import { QueryAccountTypeModel } from '../../../../core/accountType/queryaccounttype.model';
import { AccountTypeService } from '../../../../core/accountType/accountType.service';
import { QueryAccountGroupModel } from '../../../../core/accountGroup/queryag.model';

@Component({
  selector: 'kt-add-accountGroup',
  templateUrl: './add-accountGroup.component.html',
  styleUrls: ['./add-accountGroup.component.scss']
})
export class AddAccountGroupComponent implements OnInit, OnDestroy {
	// Public properties
	accountGroup: AccountGroupModel;
	AccountGroupId$: Observable<string>;
	oldAccountGroup: AccountGroupModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	accountGroupForm: FormGroup;
	hasFormErrors = false;
	// Private properties
	private subscriptions: Subscription[] = [];
	typeResult: any[] = [];
	accountResult: any[] = [];
	selection = new SelectionModel<AccountGroupModel>(true, []);
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private accountGroupFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: AccountGroupService,
		private serviceAccount: AccountTypeService,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectAccountGroupActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectAccountGroupById(id))).subscribe(res => {
					if (res) {
						this.accountGroup = res;
						this.oldAccountGroup = Object.assign({}, this.accountGroup);
						this.initAccountGroup();
					}
				});
			} else {
				this.accountGroup = new AccountGroupModel();
				this.accountGroup.clear();
				this.initAccountGroup();
			}
		});
		this.subscriptions.push(routeSubscription);
  	}

	initAccountGroup() {
		this.createForm();
		this.loadAccount();
		this.loadParent()
	}


	createForm() {
		if(this.accountGroup._id){
			this.loadAccount();
			this.accountGroupForm = this.accountGroupFB.group({
			acctType: [this.accountGroup.acctType._id, Validators.required],
			acctNo: [this.accountGroup.acctNo, Validators.required],
			acctName: [this.accountGroup.acctName, Validators.required],
			parents : [this.accountGroup.parents]
		});
		}else{
			this.accountGroupForm = this.accountGroupFB.group({
				acctType: ["", Validators.required],
				acctNo: ["", Validators.required],
				acctName: ["", Validators.required],
				parents : [this.accountGroup.parents]
			});
		}
	}

	loadAccount(){
		this.selection.clear();
		const queryParams = new QueryAccountTypeModel(
			null,
			"asc",
			null,
			1,
			10
		);
		this.serviceAccount.getListAccountType(queryParams).subscribe(
			res => {
				this.typeResult = res.data;	
			}
		);
	}

	loadParent(){
		this.selection.clear();
		const queryParams = new QueryAccountGroupModel(
			null,
			"asc",
			null,
			1,
			10
		);
		this.service.getListAccountGroup(queryParams).subscribe(
			res => {
				this.accountResult = res.data;	
			}
		);
	}




	goBackWithId() {
		const url = `/accountGroup`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshAccountGroup(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/accountGroup/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.accountGroup = Object.assign({}, this.oldAccountGroup);
		this.createForm();
		this.hasFormErrors = false;
		this.accountGroupForm.markAsPristine();
		this.accountGroupForm.markAsUntouched();
		this.accountGroupForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.accountGroupForm.controls;
		/** check form */
		if (this.accountGroupForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedAccountGroup = this.prepareAccountGroup();

		if (editedAccountGroup._id) {
			this.updateAccountGroup(editedAccountGroup, withBack);
			return;
		}

		this.addAccountGroup(editedAccountGroup, withBack);
	}

	prepareAccountGroup(): AccountGroupModel {
		const controls = this.accountGroupForm.controls;
		const _accountGroup = new AccountGroupModel();
		_accountGroup.clear();
		_accountGroup._id = this.accountGroup._id;
		_accountGroup.acctType = controls.acctType.value;
		_accountGroup.acctNo = controls.acctNo.value;
		_accountGroup.acctName = controls.acctName.value;
		_accountGroup.parents = controls.parents.value;
		return _accountGroup;
	}

	addAccountGroup( _accountGroup: AccountGroupModel, withBack: boolean = false) {
		const addSubscription = this.service.createAccountGroup(_accountGroup).subscribe(
			res => {
				const message = `New Account Group successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/accountGroup`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding account group | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	updateAccountGroup(_accountGroup: AccountGroupModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateAccountGroup(_accountGroup).subscribe(
			res => {
				const message = `Account Group successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/accountGroup`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding account group | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'Create Account Group';
		if (!this.accountGroup || !this.accountGroup._id) {
			return result;
		}

		result = `Edit Account Group`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
}
