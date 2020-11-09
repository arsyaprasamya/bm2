// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// CRUD
import { LayoutUtilsService, TypesUtilsService } from '../../../../core/_base/crud';
// Services and Models
import { DepositUpdated, DepositOnServerCreated } from '../../../../core/deposit/deposit.action';
import { selectLastCreatedDepositId, selectDepositPageLoading, selectDepositActionLoading, selectDepositById} from '../../../../core/deposit/deposit.selector'
import { DepositModel } from '../../../../core/deposit/deposit.model';
import { SelectionModel } from '@angular/cdk/collections';
import moment from 'moment';
import { QueryOwnerTransactionModel } from '../../../../core/contract/ownership/queryowner.model';
import { OwnershipContractService } from '../../../../core/contract/ownership/ownership.service';
import { LeaseContractService } from '../../../../core/contract/lease/lease.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositService } from '../../../../core/deposit/deposit.service';
import { LayoutConfigService } from '../../../../core/_base/layout';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-view',
	templateUrl: './view-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ViewComponent implements OnInit {
	// Public properties
	deposit: DepositModel;
	depositForm: FormGroup;
	hasFormErrors = false;
    viewLoading = false;
	depositId$: Observable<string>;
	oldDeposit: DepositModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	selection = new SelectionModel<DepositModel>(true, []);
	ownResult: any[] = [];
	datedefault: string;
	codenum: any;
	date = new FormControl(moment());
	date1 = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
    
	// Private properties
	private subscriptions: Subscription[] = [];
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DepositEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(public dialogRef: MatDialogRef<ViewComponent>,
		        //    @Inject(MAT_DIALOG_DATA) public data: any,
		        // //    private fb: FormBuilder,
                //    private store: Store<AppState>,
				//    private depositFB: FormBuilder,
				//    private ownService: OwnershipContractService,
				//    private leaseService : LeaseContractService,
                   
				//    private typesUtilsService: TypesUtilsService) {}
				private activatedRoute: ActivatedRoute,
				private router: Router,
				private depositFB: FormBuilder,
				private layoutUtilsService: LayoutUtilsService,
				private store: Store<AppState>,
				private ownService: OwnershipContractService,
				private leaseService : LeaseContractService,
				private service: DepositService,
				private layoutConfigService: LayoutConfigService) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	// ngOnInit() {
	// 	this.store.pipe(select(selectDepositActionLoading)).subscribe(res => this.viewLoading = res);
	// 	this.deposit = this.data.deposit;
	// 	this.createForm();
	// 	this.loadUnit();
	// }
	
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectDepositActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if(id){
				this.store.pipe(select(selectDepositById(id))).subscribe(res => {
					if (res) {
						this.deposit = res;
						this.oldDeposit = Object.assign({}, this.deposit);
						this.initDeposit();
					}
				});

			}
		});
		this.subscriptions.push(routeSubscription);
	}
	initDeposit() {
		this.createForm();
		this.loadUnit();
	}
    

	/**
	 * On destroy
	 */
	// ngOnDestroy() {
	// 	if (this.componentSubscriptions) {
	// 		this.componentSubscriptions.unsubscribe();
	// 	}
	// }

	createForm() {
        this.depositForm = this.depositFB.group({
			// receiveno: [{value:this.deposit.receiveno, disabled:true}],
			// custname : [{value:this.deposit.custname, disabled:true}],
			// desc : [{value:this.deposit.desc, disabled:true}],
			// contract : [{value:this.deposit.contract, disabled:true}],
			// invoicedteout:[{value:this.deposit.invoicedteout, disabled:true}],
			// invoicedte: [{value:this.deposit.invoicedte, disabled:true}],
			// firstnamecs: [{value:this.deposit.firstnamecs, disabled:true}],
			pymnttype:[{value:this.deposit.pymnttype, disabled:true}],
			descout:[this.deposit.descout],
			total : [{value:this.deposit.total, disabled:true}],
			dpstin :[{value:this.deposit.dpstin, disabled:true}],
			dpstout:[this.deposit.dpstout],
		});
	}

	loadUnit(){
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(null,
			"asc",
			null,
			1,
			1000);
		this.ownService.getAllDataUnit(queryParams).subscribe(
			res => {
				this.ownResult = res.data;
			
			}
		);
	}

	getSingleCustomer(id){
		const controls = this.depositForm.controls;
		this.ownService.findOwneshipById(id).subscribe(data =>{
				controls.custname.setValue(data.data.contact_name);
				}
		);
		this.leaseService.findLeaseById(id).subscribe(
			data => {
				controls.custname.setValue(data.data.contact_name);
			}
		);
				
	}
	

	/**
	 * Returns page title
	 */
	getTitle(): string {
		return 'View Deposit';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */


	/** ACTIONS */

	/**
	 * Returns prepared deposit
	 */
	prepareDeposit(): DepositModel {
		const controls = this.depositForm.controls;
		const _deposit = new DepositModel();
		_deposit.clear();
		_deposit._id = this.deposit._id;
		// _deposit.receiveno = controls.receiveno.value;
		// _deposit.custname = controls.custname.value.toLowerCase();
		// _deposit.contract = controls.contract.value.toLowerCase();
		// _deposit.desc = controls.desc.value;
		// _deposit.invoicedte = controls.invoicedte.value;
		// _deposit.pymnttype = controls.pymnttype.value;
		// _deposit.firstnamecs = controls.firstnamecs.value;
		// _deposit.descout = controls.descout.value;
		// _deposit.invoicedteout = controls.invoicedteout.value;
		_deposit.total = controls.total.value;
		_deposit.dpstin = controls.dpstin.value;
		_deposit.dpstout = controls.dpstout.value;
		return _deposit;
	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
