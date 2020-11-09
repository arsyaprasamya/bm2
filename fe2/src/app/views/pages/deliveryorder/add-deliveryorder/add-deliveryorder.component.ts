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
import {DeliveryorderModel} from "../../../../core/deliveryorder/deliveryorder.model";
import {
	selectLastCreatedDeliveryorderId,
	selectDeliveryorderActionLoading,
	selectDeliveryorderById
} from "../../../../core/deliveryorder/deliveryorder.selector";
import {DeliveryorderService} from '../../../../core/deliveryorder/deliveryorder.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OwnershipContractService } from '../../../../core/contract/ownership/ownership.service';
import { CategoryService } from '../../../../core/category/category.service';
import { SubdefectService } from '../../../../core/subdefect/subdefect.service';
import { DefectService } from '../../../../core/defect/defect.service';
import { QueryOwnerTransactionModel } from '../../../../core/contract/ownership/queryowner.model';
import { QueryCategoryModel } from '../../../../core/category/querycategory.model';
import { QueryDefectModel } from '../../../../core/defect/querydefect.model';
import { QuerySubdefectModel } from '../../../../core/subdefect/querysubdefect.model';
import { HttpClient } from '@angular/common/http';
import { QueryEngineerModel } from '../../../../core/engineer/queryengineer.model';
import { EngineerService } from '../../../../core/engineer/engineer.service';
import { LeaseContractService } from '../../../../core/contract/lease/lease.service';

@Component({
  selector: 'kt-add-deliveryorder',
  templateUrl: './add-deliveryorder.component.html',
  styleUrls: ['./add-deliveryorder.component.scss']
})
export class AddDoComponent implements OnInit, OnDestroy {
	// Public properties
	deliveryorder: DeliveryorderModel;
	DeliveryorderId$: Observable<string>;
	oldDeliveryorder: DeliveryorderModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	deliveryorderForm: FormGroup;
	selection = new SelectionModel<DeliveryorderModel>(true, []);
	hasFormErrors = false;
	unitResult: any[]=[];
	enResult: any[]=[];
	myFiles: any [] = []
	images: any [] = []
	imagest: any [] = []
	cResult: any[]=[];
	dResult: any[]=[];
	sResult: any[]=[];
	API_URL_DO = 'http://localhost:3000/api/do'

	//button hidden
	isHidden: boolean = true;
	buttonVisit: boolean = true;
	buttonFixed : boolean = true;
	buttonInputImage : boolean = true;
	buttonSubmit : boolean = true
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private deliveryorderFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: DeliveryorderService,
		private ownService: OwnershipContractService,
		private leaseService: LeaseContractService,
		private cService : CategoryService,
		private dService : DefectService,
		private sService : SubdefectService,
		private enService : EngineerService,
		private http : HttpClient,
		private layoutConfigService: LayoutConfigService
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectDeliveryorderActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectDeliveryorderById(id))).subscribe(res => {
					if (res) {
						this.deliveryorder = res;
						this.oldDeliveryorder = Object.assign({}, this.deliveryorder);
						this.initDeliveryorder();
					}
				});
			} else {
				this.deliveryorder = new DeliveryorderModel();
				this.deliveryorder.clear();
				this.initDeliveryorder();
			}
		});
		this.subscriptions.push(routeSubscription);
		this.getImage();
	  }
	  
	  

	initDeliveryorder() {
		this.createForm();
		this.loadUnit();
		this.loadCategory();
		this.loadEnginer();
		this.getUnitId(this.deliveryorder.ticket.contract)
        this.loadDefect(this.deliveryorder.ticket.subDefect.category)
		this.loadSubdefect(this.deliveryorder.ticket.subDefect.defect)
		this.hiddenVisit()
		this.hiddenFixed()
	}

	showHidden(){
		this.isHidden = true;
	}

	hiddenVisit(){
		if (this.deliveryorder.status != "scheduled"){
			this.buttonVisit = true;
			this.buttonFixed = false;
		}else{
			this.buttonVisit = false;
			this.buttonFixed = true;
		}
	}

	hiddenFixed(){
		if (this.deliveryorder.status == "fixed"){
			this.buttonInputImage = true;
			this.buttonSubmit = true;
		}else if (this.deliveryorder.status == "visit"){
			this.buttonInputImage = false;
			this.buttonSubmit = false;
		}
	}

	createForm() {
		if (this.deliveryorder.status == "scheduled"){
				this.deliveryorderForm = this.deliveryorderFB.group({
				doId: [{value:this.deliveryorder.doId, disabled:true}],
				ticket: [{value:this.deliveryorder.ticket, disabled:true}],
				ticketId: [{value:this.deliveryorder.ticket.ticketId, disabled:true}],
				ticketDate: [{value:this.deliveryorder.ticket.createdDate, disabled:true}],
				ticketUnit: [{value:this.deliveryorder.ticket.contract, disabled:true}],
				tenantName: [{value:this.deliveryorder.ticket.contract.contact_name, disabled:true}],
				tenantPhone: [{value:this.deliveryorder.ticket.contract.contact_phone, disabled:true}],
				tenantEmail: [{value:this.deliveryorder.ticket.contract.contact_email, disabled:true}],
				ticketSubject: [{value:this.deliveryorder.ticket.subject, disabled:true}],
				// ticketStatus: [{value:this.deliveryorder.ticket.status, disabled:true}],
				ticketPriority: [{value:this.deliveryorder.ticket.priority, disabled:true}],
				category :[{value:this.deliveryorder.ticket.subDefect.category, disabled:true}],
				dcategory:[{value:this.deliveryorder.ticket.subDefect.defect, disabled:true}],
				subDefect: [{value:this.deliveryorder.ticket.subDefect._id, disabled:true}],
				ticketDescription: [{value:this.deliveryorder.ticket.description, disabled:true}],
				dateScheduled: [{value:this.deliveryorder.ticket.dateScheduled, disabled:true}],
				engineerId: [{value:this.deliveryorder.ticket.engineerId, disabled:true}],
				status: [{value:this.deliveryorder.status, disabled:true}]
			});
		}else if (this.deliveryorder.status == "visit") {
			this.deliveryorderForm = this.deliveryorderFB.group({
				doId: [{value:this.deliveryorder.doId, disabled:true}],
				ticket: [{value:this.deliveryorder.ticket, disabled:true}],
				ticketId: [{value:this.deliveryorder.ticket.ticketId, disabled:true}],
				ticketDate: [{value:this.deliveryorder.ticket.createdDate, disabled:true}],
				ticketUnit: [{value:this.deliveryorder.ticket.contract, disabled:true}],
				tenantName: [{value:this.deliveryorder.ticket.contract.contact_name, disabled:true}],
				tenantPhone: [{value:this.deliveryorder.ticket.contract.contact_phone, disabled:true}],
				tenantEmail: [{value:this.deliveryorder.ticket.contract.contact_email, disabled:true}],
				ticketSubject: [{value:this.deliveryorder.ticket.subject, disabled:true}],
				// ticketStatus: [{value:this.deliveryorder.ticket.status, disabled:true}],
				ticketPriority: [{value:this.deliveryorder.ticket.priority, disabled:true}],
				category :[{value:this.deliveryorder.ticket.subDefect.category, disabled:true}],
				dcategory:[{value:this.deliveryorder.ticket.subDefect.defect, disabled:true}],
				subDefect: [{value:this.deliveryorder.ticket.subDefect._id, disabled:true}],
				ticketDescription: [{value:this.deliveryorder.ticket.description, disabled:true}],
				dateScheduled: [{value:this.deliveryorder.ticket.dateScheduled, disabled:true}],
				engineerId: [{value:this.deliveryorder.ticket.engineerId, disabled:true}],
				status: [{value:this.deliveryorder.status, disabled:true}],
				description:["", Validators.required],
				fixedDate : [{value:this.deliveryorder.fixedDate}, Validators.required],
				attachment: [null],
			});
		}else if (this.deliveryorder.status == "fixed") 
			{
				this.deliveryorderForm = this.deliveryorderFB.group({
					doId: [{value:this.deliveryorder.doId, disabled:true}],
					ticket: [{value:this.deliveryorder.ticket, disabled:true}],
					ticketId: [{value:this.deliveryorder.ticket.ticketId, disabled:true}],
					ticketDate: [{value:this.deliveryorder.ticket.createdDate, disabled:true}],
					ticketUnit: [{value:this.deliveryorder.ticket.contract, disabled:true}],
					tenantName: [{value:this.deliveryorder.ticket.contract.contact_name, disabled:true}],
					tenantPhone: [{value:this.deliveryorder.ticket.contract.contact_phone, disabled:true}],
					tenantEmail: [{value:this.deliveryorder.ticket.contract.contact_email, disabled:true}],
					ticketSubject: [{value:this.deliveryorder.ticket.subject, disabled:true}],
					// ticketStatus: [{value:this.deliveryorder.ticket.status, disabled:true}],
					ticketPriority: [{value:this.deliveryorder.ticket.priority, disabled:true}],
					category :[{value:this.deliveryorder.ticket.subDefect.category, disabled:true}],
					dcategory:[{value:this.deliveryorder.ticket.subDefect.defect, disabled:true}],
					subDefect: [{value:this.deliveryorder.ticket.subDefect._id, disabled:true}],
					ticketDescription: [{value:this.deliveryorder.ticket.description, disabled:true}],
					dateScheduled: [{value:this.deliveryorder.ticket.dateScheduled, disabled:true}],
					engineerId: [{value:this.deliveryorder.ticket.engineerId, disabled:true}],
					status: [{value:this.deliveryorder.status, disabled:true}],
					description:[{value:this.deliveryorder.description, disabled:true}, Validators.required],
					fixedDate : [{value:this.deliveryorder.fixedDate, disabled:true}, Validators.required],
					attachment: [null],
				});

		}
	}

	async getImage(){
		const URL_IMAGE = 'http://localhost:3000/api/ticket'
		await this.http.get(`${URL_IMAGE}/${this.deliveryorder.ticket._id}/image`).subscribe((res: any) => {
				this.imagest = res.data;
		 });
	}

	loadUnit() {
		this.selection.clear();
		const queryParams = new QueryOwnerTransactionModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.ownService.getAllDataUnit(queryParams).subscribe(
			res => {
				this.unitResult = res.data;
			}
		);
	}

	getUnitId(id) {
		const controls = this.deliveryorderForm.controls;
		this.ownService.findOwneshipById(id).subscribe(
			data => {
				controls.tenantName.setValue(data.data.contact_name);
				controls.tenantPhone.setValue(data.data.contact_phone);
				controls.tenantEmail.setValue(data.data.contact_email);
			}
		);
		this.leaseService.findLeaseById(id).subscribe(
			data => {
				controls.tenantName.setValue(data.data.contact_name);
				controls.tenantPhone.setValue(data.data.contact_phone);
				controls.tenantEmail.setValue(data.data.contact_email);
			}
		);
	}

	loadEnginer() {
		this.selection.clear();
		const queryParams = new QueryEngineerModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.enService.getListEngineer(queryParams).subscribe(
			res => {
				this.enResult = res.data;
			}
		);
	}

	uploadFile(event) {
		const files = (event.target as HTMLInputElement).files;
		for (var i = 0; i < files.length; i++) { 
			this.myFiles.push(files[i]);
			const image = {
				url : ''
			}
			const reader = new FileReader();
			reader.onload =  (filedata) => {
				image.url = reader.result + '';
				this.images.push(image)
			};
			reader.readAsDataURL(files[i])	
		}
	}

	getStatus(){
	if (this.deliveryorder.status == "scheduled"){
		const controls = this.deliveryorderForm.controls;
		controls.status.setValue("visit");
		}
	else if (this.deliveryorder.status == "visit"){
		const controls = this.deliveryorderForm.controls;
		controls.status.setValue("fixed");
		}
	}

	loadCategory() {
		this.selection.clear();
		const queryParams = new QueryCategoryModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.cService.getListCategory(queryParams).subscribe(
			res => {
				this.cResult = res.data;
			}
		);
	}

	categoryOnChange(id){
		if(id){
			this.loadDefect(id);
		}
	}

	loadDefect(id) {
		this.selection.clear();
		const queryParams = new QueryDefectModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.dService.getListDefectbyCategoryId(id).subscribe(
			res => {
				this.dResult = res.data;
			}
		);
	}

	defectOnChange(id){
		if(id){
			this.loadSubdefect(id);
		}
	}

	loadSubdefect(id) {
		this.selection.clear();
		const queryParams = new QuerySubdefectModel(
			null,
			"asc",
			null,
			1,
			1000
		);
		this.sService.findSubdefectByIdParent(id).subscribe(
			res => {
				this.sResult = res.data;
			}
		);
	}
	goBackWithId() {
		const url = `/deliveryorder`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshDeliveryorder(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/deliveryorder/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.deliveryorder = Object.assign({}, this.oldDeliveryorder);
		this.createForm();
		this.hasFormErrors = false;
		this.deliveryorderForm.markAsPristine();
		this.deliveryorderForm.markAsUntouched();
		this.deliveryorderForm.updateValueAndValidity();
	}

	getComponentTitle() {
		if (this.deliveryorder.status == "fixed"){
		let result = `View Delivery Order`;
		return result;
		}
		else{
		let result = `Update Delivery Order`;
		return result;
		}
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	submitForm() {
	if (this.deliveryorder.status == "scheduled"){
		var formData: any = new FormData();
		this.getStatus();
		formData.append("doId", this.deliveryorderForm.get('doId').value);
		formData.append("ticketId", this.deliveryorderForm.get('ticketId').value);
		formData.append("status", this.deliveryorderForm.get('status').value);

		this.http.patch(`${this.API_URL_DO}/${this.deliveryorder._id}`, formData).subscribe(
		(response) => {
				const message = `Delivery order successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/deliveryorder`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		},
		  (error) =>  {
						console.error(error);
						const message = 'Error while adding delivery order | ' + error.statusText;
						this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
					}
		)
	  }else if(this.deliveryorder.status == "visit"){
		var formData: any = new FormData();
		this.getStatus();
		for (var i = 0; i < this.myFiles.length; i++) { 
			formData.append("attachment", this.myFiles[i]);
		}
		formData.append("doId", this.deliveryorderForm.get('doId').value);
		formData.append("ticketId", this.deliveryorderForm.get('ticketId').value);
		formData.append("status", this.deliveryorderForm.get('status').value);
		formData.append("description", this.deliveryorderForm.get('description').value);
		formData.append("fixedDate", this.deliveryorderForm.get('fixedDate').value);

		this.http.patch(`${this.API_URL_DO}/${this.deliveryorder._id}`, formData).subscribe(
		(response) => {
				const message = `Delivery order successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/deliveryorder`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		},
		  (error) =>  {
						console.error(error);
						const message = 'Error while adding delivery order | ' + error.statusText;
						this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
					}
		)
	  }

	}

	removeAll(){
		// Remove all images on array
		while(this.myFiles.length) {
			console.log('Deleting: ', this.myFiles[0]);
			this.myFiles.shift();
			this.images.shift();
		}

		(<HTMLInputElement>document.querySelector('#input')).value = null;

		// Make sure all files are deleted
		!(this.myFiles.length > 0)
		? console.log('Image cleared!')
		: console.log(this.myFiles);

		console.log((<HTMLInputElement>document.querySelector('#input')).value);
	}
	

	
	

	
}
