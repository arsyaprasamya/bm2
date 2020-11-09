import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AccountGroupModel } from './accountGroup.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryAccountGroupModel } from './queryag.model';

const API_ACCOUNT_URL = 'http://localhost:3000/api/acct';

// const API_CSV = 'http://localhost:3000/api/excel/accountGroup/export';

@Injectable({
	providedIn: 'root'
})
export class AccountGroupService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListAccountGroup(queryParams: QueryAccountGroupModel): Observable<QueryResultsModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		let options = {
			param: JSON.stringify(queryParams)
		}
		let params = new URLSearchParams();
		for (let key in options) {
			params.set(key, options[key])
		}
		return this.http.get<QueryResultsModel>(API_ACCOUNT_URL + '?' + params,{ headers: httpHeaders });
	}

	
	findAccountGroupById(_id: string): Observable<AccountGroupModel>{
		return this.http.get<AccountGroupModel>(`${API_ACCOUNT_URL}/${_id}`);
	}
	deleteAccountGroup(accountGroupId: string) {
		const url = `${API_ACCOUNT_URL}/${accountGroupId}`;
		return this.http.delete(url);
	}
	updateAccountGroup(accountGroup: AccountGroupModel) {
		const url = `${API_ACCOUNT_URL}/${accountGroup._id}`;
		return this.http.patch(url, accountGroup);
	}
	createAccountGroup(accountGroup: AccountGroupModel): Observable<AccountGroupModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<AccountGroupModel>(`${API_ACCOUNT_URL}/`, accountGroup, { headers: httpHeaders});
	}

	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}

	// exportExcel() : Observable<any>{
	// 	return FileSaver.saveAs(`${API_CSV}`, "export-accountGroup.xlsx");
	// }
}
