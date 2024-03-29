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
import {TicketModel} from "../../../../core/ticket/ticket.model";
import {
	selectLastCreatedTicketId,
	selectTicketActionLoading,
	selectTicketById
} from "../../../../core/ticket/ticket.selector";
import {TicketService} from '../../../../core/ticket/ticket.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OwnershipContractService } from '../../../../core/contract/ownership/ownership.service';
import { QueryOwnerTransactionModel } from '../../../../core/contract/ownership/queryowner.model';
import { CategoryService } from '../../../../core/category/category.service';
import { QueryCategoryModel } from '../../../../core/category/querycategory.model';
import { QueryDefectModel } from '../../../../core/defect/querydefect.model';
import { DefectService } from '../../../../core/defect/defect.service';
import { SubdefectService } from '../../../../core/subdefect/subdefect.service';
import { QuerySubdefectModel } from '../../../../core/subdefect/querysubdefect.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LeaseContractService } from '../../../../core/contract/lease/lease.service';
import { QueryEngineerModel } from '../../../../core/engineer/queryengineer.model';
import { EngineerService } from '../../../../core/engineer/engineer.service';

@Component({
  selector: 'kt-edit-rating',
  templateUrl: './edit-rating.component.html',
  styleUrls: ['./edit-rating.component.scss']
})
export class EditRatingComponent implements OnInit, OnDestroy {
	// Public properties
	ticket: TicketModel;
	TicketId$: Observable<string>;
	oldTicket: TicketModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	ticketForm: FormGroup;
	selection = new SelectionModel<TicketModel>(true, []);
	hasFormErrors = false;
	unitResult: any[]=[];
	enResult: any[]=[];
	myFiles: any [] = []
	images: any;
	cResult: any[]=[];
	dResult: any[]=[];
	sResult: any[]=[];
    codenum : any;
    selectedFile: File;
	retrievedImage: any;
	base64Data: any;
	message: string;
	
	imageName: any;
	//button hidden
	isHidden: boolean = true;
	buttonReshedule: boolean = true;
	buttonView : boolean = true
	// Private properties
	private subscriptions: Subscription[] = [];
  	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private ticketFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private service: TicketService,
		private ownService: OwnershipContractService,
		private leaseService : LeaseContractService,
		private cService : CategoryService,
		private dService : DefectService,
		private sService : SubdefectService,
		private enService : EngineerService,
		private layoutConfigService: LayoutConfigService,
        private http : HttpClient,
		private sanitizer: DomSanitizer,
	) { }

  	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectTicketActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectTicketById(id))).subscribe(res => {
					if (res) {
						this.ticket = res;
						this.oldTicket = Object.assign({}, this.ticket);
						this.initTicket();
					}
				});
			} else {
				this.ticket = new TicketModel();
				this.ticket.clear();
				this.initTicket();
			}
		});
		this.subscriptions.push(routeSubscription);
		this.getImage();
  	}

	initTicket() {
		this.createForm();
		this.loadUnit();
        this.loadDefect(this.ticket.subDefect.category)
		this.loadSubdefect(this.ticket.subDefect.defect)
		this.hiddenReschedule()
		this.getUnitId(this.ticket.contract)
		this.loadEnginer();
	}

	showHidden(){
		this.isHidden = true;
	}

	hiddenReschedule(){
		if (this.ticket.status == "done"){
				this.buttonReshedule = false;
				if (this.ticket.rating == null){
					this.buttonView = false
				}else{
					this.buttonReshedule = false;
				}
		}else{
			this.buttonReshedule = true;
			this.buttonView = true
		}
	}


	createForm() {
		if (this.ticket.status == "done" && this.ticket.rating == null) {
			this.loadCategory();
			this.ticketForm = this.ticketFB.group({
			ticketId: [{value:this.ticket.ticketId, disabled:true}],
			subject: [{value:this.ticket.subject,disabled:true}],
			contract: [{value:this.ticket.contract, disabled:true}],
			tenant_name:[{value:this.ticket.contract.contact_name, disabled:true}],
			tenant_phone:[{value:this.ticket.contract.contact_phone, disabled:true}],
			tenant_email : [{value:this.ticket.contract.contact_email, disabled:true}],
			category :[{value:this.ticket.subDefect.category, disabled:true}],
			dcategory:[{value:this.ticket.subDefect.defect, disabled:true}],
			subDefect: [{value:this.ticket.subDefect._id, disabled:true}],
			description: [{value:this.ticket.description, disabled:true}],
			priority: [{value:this.ticket.priority, disabled:true}],
			status: [{value:this.ticket.status, disabled:true}],
			attachment : [this.ticket.attachment],
			dateScheduled: [{value:this.ticket.dateScheduled, disabled:true}],
			engineerId: [{value:this.ticket.engineerId, disabled:true}],
			ticketdate: [{value:this.ticket.createdDate, disabled:true}],
			createdDate : [{value:this.ticket.createdDate, disabled:true}],
			rating : ["", Validators.required],
			feedback : ["",Validators.required],
			});
		}else {
			this.loadCategory();
			this.ticketForm = this.ticketFB.group({
			ticketId: [{value:this.ticket.ticketId, disabled:true}],
			subject: [{value:this.ticket.subject,disabled:true}],
			contract: [{value:this.ticket.contract, disabled:true}],
			tenant_name:[{value:this.ticket.contract.contact_name, disabled:true}],
			tenant_phone:[{value:this.ticket.contract.contact_phone, disabled:true}],
			tenant_email : [{value:this.ticket.contract.contact_email, disabled:true}],
			category :[{value:this.ticket.subDefect.category, disabled:true}],
			dcategory:[{value:this.ticket.subDefect.defect, disabled:true}],
			subDefect: [{value:this.ticket.subDefect._id, disabled:true}],
			description: [{value:this.ticket.description, disabled:true}],
			priority: [{value:this.ticket.priority, disabled:true}],
			status: [{value:this.ticket.status, disabled:true}],
			attachment : [this.ticket.attachment],
			dateScheduled: [{value:this.ticket.dateScheduled, disabled:true}],
			engineerId: [{value:this.ticket.engineerId, disabled:true}],
			ticketdate: [{value:this.ticket.createdDate, disabled:true}],
			createdDate : [{value:this.ticket.createdDate, disabled:true}],
			rating : [{value:this.ticket.rating, disabled:true}, Validators.required],
			feedback : [{value:this.ticket.feedback, disabled:true},Validators.required],
			});

		}
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


	getUnitId(id) {
		const controls = this.ticketForm.controls;
		this.ownService.findOwneshipById(id).subscribe(
			data => {
				controls.tenant_name.setValue(data.data.contact_name);
				controls.tenant_phone.setValue(data.data.contact_phone);
				controls.tenant_email.setValue(data.data.contact_email);
			}
		);
		this.leaseService.findLeaseById(id).subscribe(
			data => {
				controls.tenant_name.setValue(data.data.contact_name);
				controls.tenant_phone.setValue(data.data.contact_phone);
				controls.tenant_email.setValue(data.data.contact_email);
			}
		);
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
		const url = `/rating`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshTicket(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/rating/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.ticket = Object.assign({}, this.oldTicket);
		this.createForm();
		this.hasFormErrors = false;
		this.ticketForm.markAsPristine();
		this.ticketForm.markAsUntouched();
		this.ticketForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.ticketForm.controls;
		/** check form */
		if (this.ticketForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedTicket = this.prepareTicket();
		this.updateTicket(editedTicket, withBack);

	}

	prepareTicket(): TicketModel {
		if (this.ticket.status === "done")
		{
			const controls = this.ticketForm.controls;
			const _ticket = new TicketModel();
			_ticket.clear();
			_ticket._id = this.ticket._id;
			_ticket.ticketId = controls.ticketId.value;
			_ticket.createdDate = controls.createdDate.value;
			_ticket.subject = controls.subject.value;
			_ticket.dateScheduled = controls.dateScheduled.value;
			_ticket.contract = controls.contract.value;
			_ticket.engineerId = controls.engineerId.value;
			_ticket.subDefect = controls.subDefect.value;
			_ticket.description = controls.description.value;
			_ticket.priority = controls.priority.value;
			_ticket.dateScheduled = controls.dateScheduled.value;
			_ticket.engineerId = controls.engineerId.value;
			_ticket.attachment = controls.attachment.value;
			_ticket.status = controls.status.value;
			_ticket.rating = controls.rating.value;
			_ticket.feedback = controls.feedback.value;
			return _ticket;
		}
	}

	updateTicket(_ticket: TicketModel, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const
		const addSubscription = this.service.updateTicket(_ticket).subscribe(
			res => {
				const message = `Rating successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				const url = `/rating`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding rating | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = `Edit Rating`;
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
	async getImage(){
		const URL_IMAGE = 'http://localhost:3000/api/ticket'
		await this.http.get(`${URL_IMAGE}/${this.ticket._id}/image`).subscribe((res: any) => {
				this.images = res.data;
		 });
	}
	
}
