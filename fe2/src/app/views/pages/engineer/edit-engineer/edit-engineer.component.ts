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
  selector: 'kt-edit-engineer',
  templateUrl: './edit-engineer.component.html',
  styleUrls: ['./edit-engineer.component.scss']
})
export class EditEngineerComponent implements OnInit, OnDestroy {
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
			this.subheaderService.setTitle('Engineer');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Engineer ', page: `engineer` },
				{ title: 'Edit - Engineer', page: `engineer/edit` }
			]);
			return;
		}
	}

	createForm() {
		this.engineerForm = this.engineerFB.group({
			engnrid : [this.engineer.engnrid, Validators.required],
			name: [this.engineer.name, Validators.required],
			status: [this.engineer.status, Validators.required],
			phone: [this.engineer.phone, Validators.required],
			email: [this.engineer.email, Validators.required],
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
		const _description = 'Are you sure to Update this Engineer?';
		const _waitDesciption = 'Engineer is updating...';

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
		this.updateEngineer(editedEngineer, withBack);
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

	updateEngineer(_engineer: EngineerModel, withBack: boolean = false) {
		console.log(_engineer._id);
		const updateEngineer: Update<EngineerModel> = {
			id: _engineer._id,
			changes: _engineer
		};
		this.store.dispatch(new EngineerUpdated({partialEngineer: updateEngineer, engineer: _engineer}));
		const message = `Engineer successfully has been updated.`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (withBack) {
			this.goBackWithId();
		} else {
			this.refreshEngineer(false);
			const url = `/engineer`;
			this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		}
	}

	
	getComponentTitle() {
		let result = 'Edit Engineer';
		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
