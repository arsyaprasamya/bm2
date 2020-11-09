// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CustomerActions, CustomerActionTypes } from './customer.action';
// CRUD
import { QueryParamsModel } from '../../core/_base/crud/models/query-models/query-params.model';
// Models
import { CustomerModel } from './customer.model';

// tslint:disable-next-line:no-empty-interface
export interface CustomerState extends EntityState<CustomerModel> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedCustomerId: string;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<CustomerModel> = createEntityAdapter<CustomerModel>(
	{ selectId: model => model._id, }
);

export const initialCustomerState: CustomerState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery:  new QueryParamsModel({}),
	lastCreatedCustomerId: undefined,
	showInitWaitingMessage: true
});

export function customerReducer(state = initialCustomerState, action: CustomerActions): CustomerState {
	switch  (action.type) {
		case CustomerActionTypes.CustomerPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedCustomerId: undefined
		};
		case CustomerActionTypes.CustomerActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case CustomerActionTypes.CustomerOnServerCreated: return {
			...state
		};
		case CustomerActionTypes.CustomerCreated: return adapter.addOne(action.payload.customer, {
			...state, lastCreatedBlockId: action.payload.customer._id
		});
		case CustomerActionTypes.CustomerUpdated: return adapter.updateOne(action.payload.partialCustomer, state);
		case CustomerActionTypes.CustomerDeleted: return adapter.removeOne(action.payload.id, state);
		case CustomerActionTypes.CustomerPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case CustomerActionTypes.CustomerPageLoaded: {
			return adapter.addMany(action.payload.customer, {
				...initialCustomerState,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getCustomerState = createFeatureSelector<CustomerState>('customer');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
