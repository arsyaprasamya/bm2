// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { TicketModel } from './ticket.model';
import { QueryTicketModel } from './queryticket.model';
// Models

export enum TicketActionTypes {
	AllUsersRequested = '[Block Module] All Block Requested',
	AllUsersLoaded = '[Block API] All Block Loaded',
	TicketOnServerCreated = '[Edit Ticket Component] Ticket On Server Created',
	TicketCreated = '[Edit Ticket Dialog] Ticket Created',
	TicketUpdated = '[Edit Ticket Dialog] Ticket Updated',
	TicketDeleted = '[Ticket List Page] Ticket Deleted',
	TicketPageRequested = '[Ticket List Page] Ticket Page Requested',
	TicketPageLoaded = '[Ticket API] Ticket Page Loaded',
	TicketPageCancelled = '[Ticket API] Ticket Page Cancelled',
	TicketPageToggleLoading = '[Ticket] Ticket Page Toggle Loading',
	TicketActionToggleLoading = '[Ticket] Ticket Action Toggle Loading'
}
export class TicketOnServerCreated implements Action {
	readonly type = TicketActionTypes.TicketOnServerCreated;
	constructor(public payload: { ticket: TicketModel }) { }
}

export class TicketCreated implements Action {
	readonly type = TicketActionTypes.TicketCreated;
	constructor(public payload: { ticket: TicketModel }) { }
}


export class TicketUpdated implements Action {
	readonly type = TicketActionTypes.TicketUpdated;
	constructor(public payload: {
		partialTicket: Update<TicketModel>,
		ticket: TicketModel
	}) { }
}

export class TicketDeleted implements Action {
	readonly type = TicketActionTypes.TicketDeleted;

	constructor(public payload: { id: string }) {}
}

export class TicketPageRequested implements Action {
	readonly type = TicketActionTypes.TicketPageRequested;
	constructor(public payload: { page: QueryTicketModel }) { }
}

export class TicketPageLoaded implements Action {
	readonly type = TicketActionTypes.TicketPageLoaded;
	constructor(public payload: { ticket: TicketModel[], totalCount: number, page: QueryTicketModel  }) { }
}


export class TicketPageCancelled implements Action {
	readonly type = TicketActionTypes.TicketPageCancelled;
}

export class TicketPageToggleLoading implements Action {
	readonly type = TicketActionTypes.TicketPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class TicketActionToggleLoading implements Action {
	readonly type = TicketActionTypes.TicketActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export type TicketActions = TicketCreated
	| TicketUpdated
	| TicketDeleted
	| TicketOnServerCreated
	| TicketPageLoaded
	| TicketPageCancelled
	| TicketPageToggleLoading
	| TicketPageRequested
	| TicketActionToggleLoading;
