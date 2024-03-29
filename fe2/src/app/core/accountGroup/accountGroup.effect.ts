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
import { AccountGroupService } from './accountGroup.service';
// State
import { AppState } from '../../core/reducers';
import {
	AccountGroupActionTypes,
	AccountGroupPageRequested,
	AccountGroupPageLoaded,
	AccountGroupCreated,
	AccountGroupDeleted,
	AccountGroupUpdated,
	AccountGroupOnServerCreated,
	AccountGroupActionToggleLoading,
	AccountGroupPageToggleLoading
} from './accountGroup.action';
import { QueryAccountGroupModel } from './queryag.model';


@Injectable()
export class AccountGroupEffect {
	showPageLoadingDistpatcher = new AccountGroupPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new AccountGroupPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new AccountGroupActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new AccountGroupActionToggleLoading({ isLoading: false });

	@Effect()
	loadAccountGroupPage$ = this.actions$
		.pipe(
			ofType<AccountGroupPageRequested>(AccountGroupActionTypes.AccountGroupPageRequested),
			mergeMap(( { payload } ) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.accountGroup.getListAccountGroup(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				let res: { errorMessage: string; totalCount: any; items: any };
				const result: QueryResultsModel = {items: response[0].data, totalCount: response[0].totalCount, errorMessage: "", data:[] };
				const lastQuery: QueryAccountGroupModel = response[1];
				return new AccountGroupPageLoaded({
					accountGroup: result.items,
					totalCount: result.totalCount,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteAccountGroup$ = this.actions$
		.pipe(
			ofType<AccountGroupDeleted>(AccountGroupActionTypes.AccountGroupDeleted),
			mergeMap(( { payload } ) => {
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.accountGroup.deleteAccountGroup(payload.id);
				}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	updateAccountGroup = this.actions$
		.pipe(
			ofType<AccountGroupUpdated>(AccountGroupActionTypes.AccountGroupUpdated),
			mergeMap(( { payload } ) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.accountGroup.updateAccountGroup(payload.accountGroup);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	createBlock$ = this.actions$
		.pipe(
			ofType<AccountGroupOnServerCreated>(AccountGroupActionTypes.AccountGroupOnServerCreated),
			mergeMap(( { payload } ) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.accountGroup.createAccountGroup(payload.accountGroup).pipe(
					tap(res => {
						this.store.dispatch(new AccountGroupCreated({ accountGroup: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	constructor(private actions$: Actions, private accountGroup: AccountGroupService, private store: Store<AppState>) { }
}
