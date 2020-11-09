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
import {EngineerModel} from "../../../../core/engineer/engineer.model";
import {
	selectLastCreatedEngineerId,
	selectEngineerActionLoading,
	selectEngineerById
} from "../../../../core/engineer/engineer.selector";
import {EngineerOnServerCreated, EngineerUpdated} from "../../../../core/engineer/engineer.action";
import {EngineerService} from '../../../../core/engineer/engineer.service';

@Component({
  selector: 'kt-add-engineer',
  templateUrl: './add-engineer.component.html',
  styleUrls: ['./add-engineer.component.scss']
})
export class AddEngineerComponent implements OnInit, OnDestroy {
	// Public properties
	engineer: EngineerModel;
	engineerId$: Observable<string>;
	oldEngineer: EngineerModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	engineerForm: FormGroup;
	hasFormErrors = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private engineerFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private service: EngineerService
	) { }
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectEngineerActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.store.pipe(select(selectEngineerById(id))).subscribe(res => {
					if (res) {
						this.engineer = res;
						this.oldEngineer = Object.assign({}, this.engineer);
						this.initEngineer();
					}
				});
			} else {
				this.engineer = new EngineerModel();
				this.engineer.clear();
				this.initEngineer();
			}
		});
		this.subscriptions.push(routeSubscription);
	}
	initEngineer(){
		this.createForm();
		if (!this.engineer._id) {
			this.subheaderService.setTitle('Add Engineer');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Engineer ', page: `engineer` },
				{ title: 'Add Engineer', page: `engineer/add` }
			]);
			return;
		}
	}

	createForm() {
		this.engineerForm = this.engineerFB.group({
			engnrid : ["", Validators.required],
			name: ["", Validators.required],
			status: ["", Validators.required],
			phone: ["", Validators.required],
			email: ["", Validators.required],
		});
	}
	goBackWithId() {
		const url = `/engineer`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	refreshEngineer(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/engineer/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	reset() {
		this.engineer = Object.assign({}, this.oldEngineer);
		this.createForm();
		this.hasFormErrors = false;
		this.engineerForm.markAsPristine();
		this.engineerForm.markAsUntouched();
		this.engineerForm.updateValueAndValidity();
	}
	onSubmit(withBack: boolean = false) {
		const _title = 'Engineer';
		// tslint:disable-next-line:variable-name
		const _description = 'Are you sure to create this Engineer?';
		const _waitDesciption = 'Engineer is creating...';

		const dialogRef = this.layoutUtilsService.jobElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

		this.hasFormErrors = false;
		const controls = this.engineerForm.controls;
		/** check form */
		if (this.engineerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedEngineer = this.prepareEngineer();
		this.addEngineer(editedEngineer, withBack);
		});
	}
	prepareEngineer(): EngineerModel {
		const controls = this.engineerForm.controls;
		const _engineer = new EngineerModel();
		_engineer.clear();
		_engineer._id = this.engineer._id;
		_engineer.engnrid = controls.engnrid.value;
		_engineer.name = controls.name.value.toLowerCase();
		_engineer.status = controls.status.value;
		_engineer.phone = controls.phone.value;
		_engineer.email = controls.email.value;
		return _engineer;
	}
	addEngineer( _engineer: EngineerModel, withBack: boolean = false) {
		const addSubscription = this.service.createEngineer(_engineer).subscribe(
			res => {
				const message = `New engineer successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/engineer`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding Engineer | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	
	getComponentTitle() {
		let result = 'Create New Engineer';
		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
