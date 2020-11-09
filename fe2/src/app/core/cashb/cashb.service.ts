import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CashbModel } from './cashb.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryCashbModel } from './queryb.model';

const API_FLOOR_URL = 'http://localhost:3000/api/cashbank';
// const API_CSV = 'http://localhost:3000/api/excel/cashb/export';




@Injectable({
	providedIn: 'root'
})
export class CashbService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListCashb(queryParams: QueryCashbModel): Observable<QueryResultsModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		// let options = {
		// 	param: JSON.stringify(queryParams)
		// }
		let params = new URLSearchParams();
		// for (let key in options) {
		// 	console.log(options)
		// 	params.set(key, options[key])
		// }
		params.set("param", JSON.stringify(queryParams));
		return this.http.get<QueryResultsModel>(API_FLOOR_URL + '/list?' + params,{ headers: httpHeaders });
	}

	
	findCashbById(_id: string): Observable<CashbModel>{
		return this.http.get<CashbModel>(`${API_FLOOR_URL}/${_id}`);
	}
	deleteCashb(cashbId: string) {
		const url = `${API_FLOOR_URL}/delete/${cashbId}`;
		return this.http.delete(url);
	}
	updateCashb(cashb: CashbModel) {
		const url = `${API_FLOOR_URL}/edit/${cashb._id}`;
		return this.http.patch(url, cashb);
	}
	createCashb(cashb: CashbModel): Observable<CashbModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<CashbModel>(`${API_FLOOR_URL}/add`, cashb, { headers: httpHeaders});
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
	// 	return FileSaver.saveAs(`${API_CSV}`, "export-cashb.xlsx");
	// }
}
