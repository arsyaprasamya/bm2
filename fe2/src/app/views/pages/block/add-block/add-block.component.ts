import { Component, OnInit, OnDestroy } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BlockModel} from '../../../../core/block/block.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutConfigService, SubheaderService} from '../../../../core/_base/layout';
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../core/_base/crud';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../core/reducers';
import {
	selectBlockActionLoading,
	selectBlockById,
	selectLastCreatedBlockId
} from '../../../../core/block/block.selector'
import {BlockOnServerCreated} from '../../../../core/block/block.action';
import {SelectionModel} from '@angular/cdk/collections';
import {BlockDataSource} from '../../../../core/block/block.datasource';
import { BlockService} from '../../../../core/block/block.service';
import {BlockGroupService} from '../../../../core/blockgroup/blockgroup.service';
import {selectBlockGroupActionLoading, selectLastCreatedBlockGroupId} from '../../../../core/blockgroup/blockgroup.selector';
import {BlockgroupModel} from '../../../../core/blockgroup/blockgroup.model';
import {BlockGroupOnServerCreated} from '../../../../core/blockgroup/blockgroup.action';

@Component({
  selector: 'kt-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.scss']
})
export class AddBlockComponent implements OnInit, OnDestroy {
	dataSource: BlockDataSource;
	block: BlockModel;
	blockId$: Observable<string>;
	oldBlock: BlockModel;
	selectedTab = 0;
	loading$: Observable<boolean>;
	blockForm: FormGroup;
	hasFormErrors = false;
	selection = new SelectionModel<BlockModel>(true, []);
	blockGroupResult: any[] = [];
	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private blockFB: FormBuilder,
				private subheaderService: SubheaderService,
				private service: BlockGroupService,
				private blksrv: BlockService,
				private layoutUtilsService: LayoutUtilsService,
				private store: Store<AppState>,
				private layoutConfigService: LayoutConfigService) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectBlockGroupActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			this.block = new BlockModel();
			this.block.clear();
			this.initBlock();
		});
		this.subscriptions.push(routeSubscription);
  	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initBlock() {
		this.createForm();
		this.loadBlockGroupList();
		// this.subheaderService.setTitle('Add block');
		// this.subheaderService.setBreadcrumbs([
		// 	{ title: 'Block', page: `block` },
		// 	{ title: 'Add Block',  page: `block/add` },
		// ]);
	}

	createForm() {
		this.blockForm = this.blockFB.group({
			cdblk : ["", Validators.required],
			nmblk : ["", Validators.required],
			addrblk : ["", Validators.required],
			rw : ["", Validators.required],
			rt : ["", Validators.required],
			phnblk : ["", Validators.required],
			grpid: ["", Validators.required],
			grpnm:[""],
			space:[""],
			availspace:[""],
			month:["", Validators.required],
			dtss:[{value:"", disabled:true}]
		});
	}

	changeDays() {
		const month = this.blockForm.controls.month.value;
		if (month !== 0 ) {
				this.blockForm.controls.dtss.setValue(month * 30);
		}
	}

	goBackWithId() {
		const url = `/block`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshBlock(isNew: boolean = false, id:string = "") {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/block/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.block = Object.assign({}, this.oldBlock);
		this.createForm();
		this.hasFormErrors = false;
		this.blockForm.markAsPristine();
		this.blockForm.markAsUntouched();
		this.blockForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.blockForm.controls;
		/** check form */
		if (this.blockForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const preparedBlock = this.prepareBlock();
		this.addBlockGroup(preparedBlock, withBack);
	}
	loadBlockGroupList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			null,
			"asc",
			null,
			1,
			10
		);
		this.service.getListBlockGroup(queryParams).subscribe(
			res => {
				this.blockGroupResult = res.data;
			}
		);
	}

	getSingleProject(id){
		const controls = this.blockForm.controls;
		this.service.getBlockGroupByIdBlock(id).subscribe(data => {
			controls.grpnm.setValue(data.data.grpnm)
		});
	}


	prepareBlock(): BlockModel {
		const controls = this.blockForm.controls;
		const _block = new BlockModel();
		_block.clear();
		_block.cdblk = controls.cdblk.value.toLowerCase();
		_block.nmblk = controls.nmblk.value.toLowerCase();
		_block.grpid = controls.grpid.value;
		_block.grpnm = controls.grpnm.value.toLowerCase();
		_block.rt = controls.rt.value;
		_block.rw = controls.rw.value;
		_block.space = controls.space.value;
		_block.availspace = controls.space.value;
		_block.month = controls.month.value;
		_block.dtss = controls.dtss.value;
		_block.addrblk = controls.addrblk.value.toLowerCase();
		_block.phnblk = controls.phnblk.value;
		return _block;
	}
	addBlockGroup(_block: BlockModel, withBack: boolean = false) {
		// this.store.dispatch(new BlockOnServerCreated({ block: _block }));
		// const addSubscription = this.store.pipe(select(selectLastCreatedBlockId)).subscribe(newId => {
		// 	console.log(newId);
		// 	const message = `New block group successfully has been added.`;
		// 	this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
		// 	if (newId) {
		// 		if (withBack) {
		// 			this.goBackWithId();
		// 		} else {
		// 			this.refreshBlock(true, newId);
		// 		}
		// 	}
		// });
		const addSubscription = this.blksrv.createBlock(_block).subscribe(
			res => {
				const message = `New block successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				const url = `/block`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
			},
			err => {
				console.error(err);
				const message = 'Error while adding block | ' + err.statusText;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
			}
		);
		this.subscriptions.push(addSubscription);
	}
	getComponentTitle() {
		let result = 'Create Block';

		return result;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
