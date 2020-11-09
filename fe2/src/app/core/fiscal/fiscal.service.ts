import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FiscalModel } from './fiscal.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryFiscalModel } from './queryfiscal.model';
import { query } from 'chartist';

const API_FLOOR_URL = 'http://localhost:3000/api/fiscalfa';
const API_CSV = 'http://localhost:3000/api/excel/fiscalfa/export';




@Injectable({
	providedIn: 'root'
})
export class FiscalService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListFiscal(queryParams: QueryFiscalModel): Observable<QueryResultsModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		let params = new URLSearchParams();

		params.set("param", JSON.stringify(queryParams));
		console.log(queryParams)
		return this.http.get<QueryResultsModel>(API_FLOOR_URL + '?' + params,{ headers: httpHeaders });
	}

	
	findFiscalById(_id: string): Observable<FiscalModel>{
		return this.http.get<FiscalModel>(`${API_FLOOR_URL}/${_id}`);
	}
	deleteFiscal(fiscalId: string) {
		const url = `${API_FLOOR_URL}/${fiscalId}`;
		return this.http.delete(url);
	}
	updateFiscal(fiscal: FiscalModel) {
		const url = `${API_FLOOR_URL}/${fiscal._id}`;
		return this.http.patch(url, fiscal);
	}
	createFiscal(fiscal: FiscalModel): Observable<FiscalModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<FiscalModel>(`${API_FLOOR_URL}`, fiscal, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_CSV}`, "export-fiscal.xlsx");
	}
}
