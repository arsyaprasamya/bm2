import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DeliveryorderModel } from './deliveryorder.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryDeliveryorderModel } from './querydeliveryorder.model';

const API_FLOOR_URL = 'http://localhost:3000/api/do';
const API_CSV = 'http://localhost:3000/api/excel/do/export';

@Injectable({
	providedIn: 'root'
})
export class DeliveryorderService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListDeliveryorder(queryParams: QueryDeliveryorderModel): Observable<QueryResultsModel>{
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

	
	findDeliveryorderById(_id: string): Observable<DeliveryorderModel>{
		return this.http.get<DeliveryorderModel>(`${API_FLOOR_URL}/${_id}`);
	}
	deleteDeliveryorder(deliveryorderId: string) {
		const url = `${API_FLOOR_URL}/${deliveryorderId}`;
		return this.http.delete(url);
	}
	
	updateDeliveryorder(deliveryorder: DeliveryorderModel) {
		const url = `${API_FLOOR_URL}/${deliveryorder._id}`;
		return this.http.patch(url, deliveryorder);
	}
	createDeliveryorder(deliveryorder: DeliveryorderModel): Observable<DeliveryorderModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<DeliveryorderModel>(`${API_FLOOR_URL}`, deliveryorder, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_CSV}`, "export-deliveryorder.xlsx");
	}
}
