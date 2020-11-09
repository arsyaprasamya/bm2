// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel } from '../_base/crud';
// Services
import { TicketService } from './ticket.service';
// State
import { AppState } from '../../core/reducers';
import {
	TicketActionTypes,
	TicketPageRequested,
	TicketPageLoaded,
	TicketCreated,
	TicketDeleted,
	TicketUpdated,
	TicketOnServerCreated,
	TicketActionToggleLoading,
	TicketPageToggleLoading
} from './ticket.action';
import { QueryTicketModel } from './queryticket.model';


@Injectable()
export class TicketEffect {
	showPageLoadingDistpatcher = new TicketPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new TicketPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new TicketActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new TicketActionToggleLoading({ isLoading: false });

	@Effect()
	loadTicketPage$ = this.actions$
		.pipe(
			ofType<TicketPageRequested>(TicketActionTypes.TicketPageRequested),
			mergeMap(( { payload } ) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.ticket.getListTicket(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				let res: { errorMessage: string; totalCount: any; items: any };
				const result: QueryResultsModel = {items: response[0].data, totalCount: response[0].totalCount, errorMessage: "", data:[] };
				const lastQuery: QueryTicketModel = response[1];
				return new TicketPageLoaded({
					ticket: result.items,
					totalCount: result.totalCount,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteTicket$ = this.actions$
		.pipe(
			ofType<TicketDeleted>(TicketActionTypes.TicketDeleted),
			mergeMap(( { payload } ) => {
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.ticket.deleteTicket(payload.id);
				}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	updateTicket = this.actions$
		.pipe(
			ofType<TicketUpdated>(TicketActionTypes.TicketUpdated),
			mergeMap(( { payload } ) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.ticket.updateTicket(payload.ticket);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	createBlock$ = this.actions$
		.pipe(
			ofType<TicketOnServerCreated>(TicketActionTypes.TicketOnServerCreated),
			mergeMap(( { payload } ) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.ticket.createTicket(payload.ticket).pipe(
					tap(res => {
						this.store.dispatch(new TicketCreated({ ticket: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	constructor(private actions$: Actions, private ticket: TicketService, private store: Store<AppState>) { }
}
