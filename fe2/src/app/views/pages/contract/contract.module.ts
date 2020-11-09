// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import {ActionReducerMap, StoreModule} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
} from '@angular/material';

import {ContractComponent} from './contract.component';
import {ListLeaseComponent} from './lease/list-lease/list-lease.component';
import {AddLeaseComponent} from './lease/add-lease/add-lease.component';
import {leasecontractReducer} from '../../../core/contract/lease/lease.reducer';
import {LeaseContractEffect} from '../../../core/contract/lease/lease.effect';
import {ListOwnershipComponent} from './ownership/list-ownership/list-ownership.component';
import {AddOwnershipComponent} from './ownership/add-ownership/add-ownership.component';
import {OwnershipComponent} from './ownership/ownership.component';
import {powertransactionReducer} from '../../../core/power/transaction/transaction.reducer';
import {PowerTransactionEffect} from '../../../core/power/transaction/transaction.effect';
import {LeaseComponent} from './lease/lease.component';
import {EditLeaseComponent} from './lease/edit-lease/edit-lease.component';
import {ownershipcontractReducer} from '../../../core/contract/ownership/ownership.reducer';
import {OwnershipContractEffect} from '../../../core/contract/ownership/ownership.effect';
import { EditOwnershipComponent } from './ownership/edit-ownership/edit-ownership.component';
import {NgbTimepicker} from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
	{
		path: '',
		component: ContractComponent,
		children: [
			{
				path: 'contract/lease',
				component: ListLeaseComponent
			},
			{
				path: 'contract/lease/add',
				component: AddLeaseComponent
			},
			{
				path: 'contract/lease/edit/:id',
				component: EditLeaseComponent
			},
			{
				path: 'contract/ownership',
				component: ListOwnershipComponent

			},
			{
				path: 'contract/ownership/add',
				component: AddOwnershipComponent
			},
			{
				path: 'contract/ownership/edit/:id',
				component: EditOwnershipComponent
			},
		]
	}
];
@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('leasecontract', leasecontractReducer),
		StoreModule.forFeature('ownershipcontract', ownershipcontractReducer),
		//StoreModule.forFeature('powerTransaction', powertransactionReducer),
		EffectsModule.forFeature([LeaseContractEffect, OwnershipContractEffect]),
		//EffectsModule.forFeature([LeaseContractEffect, PowerMeterEffect, PowerTransactionEffect]),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		ContractComponent
	],
	declarations: [
		ContractComponent,
		ListLeaseComponent,
		AddLeaseComponent,
		EditLeaseComponent,
		LeaseComponent,
		OwnershipComponent,
		ListOwnershipComponent,
		AddOwnershipComponent,
		EditOwnershipComponent,
	]
})
export class ContractModule {}
