import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WaterTransactionModel } from './transaction.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {QueryResultsModel} from '../../_base/crud';

import * as FileSaver from 'file-saver';
import {HttpParams} from '@angular/common/http';
import { QueryWaterTransactionModel } from './querytransaction.model';


const API_WATER_TRANSACTION_URL = 'http://localhost:3000/api/water/transaksi';

const API_WATER_EXPORT_URL = 'http://localhost:3000/api/excel/export/water/consumption';




@Injectable({
	providedIn: 'root'
})
export class WaterTransactionService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListWaterTransaction(queryParams: QueryWaterTransactionModel): Observable<QueryResultsModel>{
		// return this.http.get<QueryResultsModel>(`${API_WATER_TRANSACTION_URL}`);
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
		return this.http.get<QueryResultsModel>(API_WATER_TRANSACTION_URL + '/list?' + params,{ headers: httpHeaders });
	}


	getListWaterUnPost(queryParams: QueryWaterTransactionModel): Observable<QueryResultsModel>{
		// return this.http.get<QueryResultsModel>(`${API_WATER_TRANSACTION_URL}`);
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
		return this.http.get<QueryResultsModel>(API_WATER_TRANSACTION_URL + '/unpost?' + params,{ headers: httpHeaders });
	}
	

	postingAll(waterTransaction : WaterTransactionModel){
		const url = `${API_WATER_TRANSACTION_URL}` + '/posting';
		return this.http.patch(url, waterTransaction);
	}

	deleteWaterTransaction(waterTransactionId: string) {
		const url = `${API_WATER_TRANSACTION_URL}/delete/${waterTransactionId}`;
		return this.http.delete(url);
	}
	getWaterTransactionUnit(unitId: string): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(`${API_WATER_TRANSACTION_URL}/unit/${unitId}`);
	}
	updateWaterTransaction(waterTransaction: WaterTransactionModel) {
		const url = `${API_WATER_TRANSACTION_URL}/edit/${waterTransaction._id}`;
		return this.http.patch(url, waterTransaction);
	}
	createWaterTransaction(waterTransaction: WaterTransactionModel): Observable<WaterTransactionModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<WaterTransactionModel>(`${API_WATER_TRANSACTION_URL}/add`, waterTransaction, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_WATER_EXPORT_URL}`, "export-water-consumption.xlsx");
	}
}
