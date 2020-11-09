import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutConfigService, SubheaderService} from '../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../core/_base/crud';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../core/reducers';
import {SelectionModel} from '@angular/cdk/collections';
import {InvoiceDataSource} from '../../../../core/invoice/invoice.datasource';
import {InvoiceModel} from '../../../../core/invoice/invoice.model';
import {InvoiceService} from '../../../../core/invoice/invoice.service';
import {selectInvoiceActionLoading, selectInvoiceById} from '../../../../core/invoice/invoice.selector';
import * as _moment from 'moment';
const moment = _rollupMoment || _moment;
import {default as _rollupMoment, Moment} from 'moment';
import { OwnershipContractService } from '../../../../core/contract/ownership/ownership.service';
import { QueryOwnerTransactionModel } from '../../../../core/contract/ownership/queryowner.model';
import { LeaseContractService } from '../../../../core/contract/lease/lease.service';

@Component({
  selector: 'kt-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit, OnDestroy {
	dataSource: InvoiceDataSource;
	invoice: InvoiceModel;
	invoiceId$: Observable<string>;
	oldInvoice: InvoiceModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	loading : boolean = false;
	invoiceForm: FormGroup;
	hasFormErrors = false;
	selection = new SelectionModel<InvoiceModel>(true, []);
	blockResult: any[] = [];
	blockGroupResult: any[] = [];
	buildingResult: any[] = [];
	datedefault: string;
	date = new FormControl(moment());
	date1 = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	codenum: any;
	blockgroupNotSelected: boolean = false;
	ownResult: any[] = [];
	
	isView : boolean = true
	// Private properties
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private invoiceFB: FormBuilder,
		private service: InvoiceService,
		private ownService: OwnershipContractService,
		private leaseService : LeaseContractService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService
	) { }
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectInvoiceActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectInvoiceById(id))).subscribe(res => {
					if (res) {
						this.invoice = res;
						this.oldInvoice = Object.assign({}, this.invoice);
						this.initInvoice();
					}
				});
			} else {
				this.invoice = new InvoiceModel();
				this.invoice.clear();
				this.initInvoice();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	initInvoice(){
		this.createForm();
		this.loadUnit();
		this.hiddenVisit();

	}

	hiddenVisit(){
		if (this.invoice._id){
			this.isView = true
		}else{
			this.isView = false
		}
	}

	createForm() {
		if (this.invoice._id){
		this.invoiceForm = this.invoiceFB.group({
			invoiceno: [{value:this.invoice.invoiceno, disabled:true}],
			custname : [{value:this.invoice.custname, disabled:true}],
			unit : [{value:this.invoice.unit, disabled:true}],
			contract : [{value:this.invoice.contract, disabled:true}],
			desc : [{value:this.invoice.desc, disabled:true}],
			invoicedte: [{value:this.invoice.invoicedte, disabled:true}],
			invoicedteout:[{value:this.invoice.invoicedteout, disabled:true}],
			total : [{value:this.invoice.total, disabled:true}],
			address : [{value:this.invoice.address}],
			discount : [{value:this.invoice.discount, disabled:true}],
			crtdate : [{value:this.invoice.crtdate, disabled:true}],
			upddate : [""],
		});
		}else{
			this.getNumber();
			this.invoiceForm = this.invoiceFB.group({
				invoiceno: [{value:"", "disabled":true}],
				custname : [""],
				unit : [""],
				contract : [""],
				desc : [""],
				invoicedte: [{value:this.date1.value, "disabled":true}],
				invoicedteout:["", Validators.required],
				type : [""],
				amount : [""],
				total : [""],
				address  : [""],
				discount : [""],
				crtdate : [{value:this.date1.value, "disabled":true}],
				upddate : [""],
			});
		}
	}

	getNumber() {
		this.service.generateInvoiceCode().subscribe(
			res => {
				this.codenum = res.data
				const controls = this.invoiceForm.controls;
				controls.invoiceno.setValue(this.codenum);
				
			}
		)
	}

	changeValue() {
		const total = this.invoiceForm.controls.total.value;
		const type = this.invoiceForm.controls.type.value;
		const diskon = this.invoiceForm.controls.discount.value;
		if (type  ===  "pr") {
				const data1  = (total / 100) * diskon
				this.invoiceForm.controls.amount.setValue(total - data1);
		}else{
			const data  = total - diskon
			this.invoiceForm.controls.amount.setValue(data);
		}
	}

	goBackWithId() {
		const url = `/invoice`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshInvoice(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/invoice/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	prepareInvoice(): InvoiceModel {
		const controls = this.invoiceForm.controls;
		const _invoice = new InvoiceModel();
		_invoice.clear();
		_invoice._id = this.invoice._id;
		_invoice.invoiceno = controls.invoiceno.value.toLowerCase();
		_invoice.custname = controls.custname.value.toLowerCase();
		_invoice.unit = controls.unit.value;
		_invoice.contract = controls.contract.value;
		_invoice.desc = controls.desc.value;
		_invoice.invoicedte = controls.invoicedte.value;
		_invoice.invoicedteout = controls.invoicedteout.value;
		_invoice.total = controls.total.value;
		_invoice.amount = controls.amount.value;
		_invoice.discount = controls.discount.value;
		_invoice.address = controls.address.value;
		_invoice.crtdate = controls.crtdate.value;
		_invoice.upddate = controls.upddate.value;
		return _invoice;
	}

	reset() {
		this.invoice = Object.assign({}, this.oldInvoice);
		this.createForm();
		this.invoiceForm.markAsPristine();
		this.invoiceForm.markAsUntouched();
		this.invoiceForm.updateValueAndValidity();
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
		 const controls = this.invoiceForm.controls;
		 this.ownService.findUnitById(id).subscribe(data =>{
			controls.custname.setValue(data.data.contact_name);
			controls.unit.setValue(data.data.unit.cdunt)
			controls.address.setValue(data.data.contact_address)
		 	}
		 );
	}

	addInvoice(_invoice: InvoiceModel, withBack: boolean = false) {
		const addSubscription = this.service.createInvoice(_invoice).subscribe(
			res => {
				const message = `New invoice successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/invoice`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding building | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.invoiceForm.controls;
		/** check form */
		if (this.invoiceForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		this.loading = true;
		const preparedInvoice = this.prepareInvoice();
		this.addInvoice(preparedInvoice, withBack);
	}



	getComponentTitle() {
		if (this.invoice._id){
			let result = 'View Invoice';
			return result;
		}else{
		let result = 'Create Invoice';
		return result;
		}
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	ngOnDestroy(){
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
