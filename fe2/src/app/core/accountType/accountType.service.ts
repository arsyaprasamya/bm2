import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AccountTypeModel } from './accountType.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryAccountTypeModel } from './queryaccounttype.model';

const API_FLOOR_URL = 'http://localhost:3000/api/acctype';
const API_CSV = 'http://localhost:3000/api/excel/acctype/export';



@Injectable({
	providedIn: 'root'
})
export class AccountTypeService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListAccountType(queryParams: QueryAccountTypeModel): Observable<QueryResultsModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		let options = {
			param: JSON.stringify(queryParams)
		}
		let params = new URLSearchParams();
		for (let key in options) {
			params.set(key, options[key])
		}
		return this.http.get<QueryResultsModel>(API_FLOOR_URL + '?' + params,{ headers: httpHeaders });
	}

	
	findAccountTypeById(_id: string): Observable<AccountTypeModel>{
		return this.http.get<AccountTypeModel>(`${API_FLOOR_URL}/${_id}`);
	}
	deleteAccountType(accountTypeId: string) {
		const url = `${API_FLOOR_URL}/${accountTypeId}`;
		return this.http.delete(url);
	}
	updateAccountType(accountType: AccountTypeModel) {
		const url = `${API_FLOOR_URL}/${accountType._id}`;
		return this.http.patch(url, accountType);
	}
	createAccountType(accountType: AccountTypeModel): Observable<AccountTypeModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<AccountTypeModel>(`${API_FLOOR_URL}`, accountType, { headers: httpHeaders});
	}

	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}

	exportExcel() : Observable<any>{
		return FileSaver.saveAs(`${API_CSV}`, "export-accountType.xlsx");
	}
}
