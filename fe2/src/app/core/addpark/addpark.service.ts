import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AddparkModel } from './addpark.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryAddparkModel } from './queryaddpark.model';

const API_FLOOR_URL = 'http://localhost:3000/api/additionalParking';
const API_CSV = 'http://localhost:3000/api/excel/additionalParking/export';

@Injectable({
	providedIn: 'root'
})
export class AddparkService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListAddpark(queryParams: QueryAddparkModel): Observable<QueryResultsModel>{
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
		return this.http.get<QueryResultsModel>(API_FLOOR_URL + '?' + params,{ headers: httpHeaders });
	}

	
	findAddparkById(_id: string): Observable<any>{
		return this.http.get<any>(`${API_FLOOR_URL}/${_id}`);
	}
	
	deleteAddpark(addparkId: string) {
		const url = `${API_FLOOR_URL}/${addparkId}`;
		return this.http.delete(url);
	}
	updateAddpark(addpark: AddparkModel) {
		const url = `${API_FLOOR_URL}/${addpark._id}`;
		return this.http.patch(url, addpark);
	}
	createAddpark(addpark: AddparkModel): Observable<AddparkModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<AddparkModel>(`${API_FLOOR_URL}`, addpark, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_CSV}`, "export-addpark.xlsx");
	}
}
