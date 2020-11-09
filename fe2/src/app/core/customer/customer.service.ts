import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CustomerModel } from './customer.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';
import {QueryParamsModel} from '../../core/_base/crud/models/query-models/query-params.model';
import * as FileSaver from 'file-saver';

const API_CUSTOMER_URL = 'http://localhost:3000/api/customer';
const API_EXCEL = 'http://localhost:3000/api/excel/customer/export';




@Injectable({
	providedIn: 'root'
})
export class CustomerService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListCustomer(queryParams: QueryParamsModel): Observable<QueryResultsModel>{
		// return this.http.get<QueryResultsModel>(`${API_CUSTOMER_URL}`);
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		// let params = new HttpParams({
		// 	fromObject: queryParams
		// });
		// @ts-ignore
		let options = {
			param: JSON.stringify(queryParams)
		}
		let params = new URLSearchParams();
		for (let key in options) {
			params.set(key, options[key])
		}
		return this.http.get<QueryResultsModel>(API_CUSTOMER_URL + '/list?' + params,{ headers: httpHeaders });
	}
	deleteCustomer(customerId: string) {
		const url = `${API_CUSTOMER_URL}/delete/${customerId}`;
		return this.http.delete(url);
	}
	getCustomerById(id: string): Observable<any>{
		return this.http.get<any>(`${API_CUSTOMER_URL}/${id}`);
	}

	
	exportExcel() : Observable<any>{
		return FileSaver.saveAs(`${API_EXCEL}`, "export-tenant.xlsx");
	}
	updateCustomer(customer: CustomerModel) {
		const url = `${API_CUSTOMER_URL}/edit/${customer._id}`;
		return this.http.patch(url, customer);
	}
	createCustomer(customer: CustomerModel): Observable<CustomerModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<CustomerModel>(`${API_CUSTOMER_URL}/add`, customer, { headers: httpHeaders});
	}
	generateCustomerCode(): Observable<QueryResultsModel>{
		const url = `${API_CUSTOMER_URL}/generate/code`;
		return this.http.get<QueryResultsModel>(url);
	}
	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}
}
