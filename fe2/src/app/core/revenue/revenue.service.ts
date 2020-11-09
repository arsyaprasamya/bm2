import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RevenueModel } from './revenue.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryRevenueModel } from './queryrevenue.model';

const API_FLOOR_URL = 'http://localhost:3000/api/mstrevenue';
const API_CSV = 'http://localhost:3000/api/excel/mstrevenue/export';




@Injectable({
	providedIn: 'root'
})
export class RevenueService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListRevenue(queryParams: QueryRevenueModel): Observable<QueryResultsModel>{
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

	
	findRevenueById(_id: string): Observable<RevenueModel>{
		return this.http.get<RevenueModel>(`${API_FLOOR_URL}/${_id}`);
	}
	deleteRevenue(revenueId: string) {
		const url = `${API_FLOOR_URL}/${revenueId}`;
		return this.http.delete(url);
	}
	updateRevenue(revenue: RevenueModel) {
		const url = `${API_FLOOR_URL}/${revenue._id}`;
		return this.http.patch(url, revenue);
	}
	createRevenue(revenue: RevenueModel): Observable<RevenueModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<RevenueModel>(`${API_FLOOR_URL}`, revenue, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_CSV}`, "export-revenue.xlsx");
	}
}
