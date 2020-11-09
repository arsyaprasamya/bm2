// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { TicketComponent } from './ticket.component';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';

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
	MatTooltipModule
} from '@angular/material';

import {ticketReducer} from '../../../core/ticket/ticket.reducer';
import {TicketEffect} from '../../../core/ticket/ticket.effect';
import { ListWfsTicketComponent } from './list-wfsticket/list-ticket.component';
import { ListRshTicketComponent } from './list-rshticket/list-ticket.component';
import { ListDoneTicketComponent } from './list-doneticket/list-ticket.component';

const routes: Routes = [
	{
		path: '',
		component: TicketComponent,
		children: [
			{
				path: '',
				component: ListTicketComponent
			},
			{
				path: 'wfs',
				component: ListWfsTicketComponent
			},
			{
				path: 'rsh',
				component: ListRshTicketComponent
			},
			{
				path: 'done',
				component: ListDoneTicketComponent
			},
			{
				path: 'edit/:id',
				component: EditTicketComponent
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('ticket', ticketReducer),
		EffectsModule.forFeature([TicketEffect]),
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
		TicketComponent
	],
	declarations: [
		TicketComponent,
		ListTicketComponent,
		ListWfsTicketComponent,
		ListRshTicketComponent,
		ListDoneTicketComponent,
		EditTicketComponent,
	]
})
export class TicketSpvModule {}
