import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UnitModel } from './unit.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';
import {QueryUnitModel} from './queryunit.model';
import * as FileSaver from 'file-saver';

const API_FLOOR_URL = 'http://localhost:3000/api/unit';
const API_EXCEL = 'http://localhost:3000/api/excel/unit/export';




@Injectable({
	providedIn: 'root'
})
export class UnitService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListUnit(queryParams: QueryUnitModel): Observable<QueryResultsModel>{
		// return this.http.get<QueryResultsModel>(`${API_FLOOR_URL}`);
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
		return this.http.get<QueryResultsModel>(API_FLOOR_URL + '/list?' + params,{ headers: httpHeaders });
	}
	getCustomerUnit(unit: string): Observable<QueryResultsModel>{
		return this.http.get<QueryResultsModel>(`${API_FLOOR_URL}/customer/${unit}`);
	}
	getUnitById(unit: QueryUnitModel): Observable<QueryResultsModel>{
		return this.http.get<QueryResultsModel>(`${API_FLOOR_URL}/${unit}`);
	}
	findUnitByParent(_id: string): Observable<QueryResultsModel>{
		return this.http.get<QueryResultsModel>(`${API_FLOOR_URL}/parent/${_id}`);
	}
	exportExcel() : Observable<any>{
		return FileSaver.saveAs(`${API_EXCEL}`, "export-unit.xlsx");
	}
	deleteUnit(unitId: string) {
		const url = `${API_FLOOR_URL}/delete/${unitId}`;
		return this.http.delete(url);
	}
	updateUnit(unit: UnitModel) {
		const url = `${API_FLOOR_URL}/edit/${unit._id}`;
		return this.http.patch(url, unit);
	}
	createUnit(unit: UnitModel): Observable<UnitModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<UnitModel>(`${API_FLOOR_URL}/add`, unit, { headers: httpHeaders});
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
