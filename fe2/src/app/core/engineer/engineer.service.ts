import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EngineerModel } from './engineer.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';
import {QueryParamsModel} from '../_base/crud/models/query-models/query-params.model';
import {QueryEngineerModel} from './queryengineer.model'
import * as FileSaver from 'file-saver';
const API_ENGINEER_URL = 'http://localhost:3000/api/engineer';
const API_ENGINEER_URL_EXPORT = 'http://localhost:3000/api/excel/engineer/export';

@Injectable({
	providedIn: 'root'
})

export class EngineerService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListEngineer(queryParams: QueryEngineerModel): Observable<QueryResultsModel>{

		// return this.http.get<QueryResultsModel>(`${API_ENGINEER_URL}`);
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');

		let options = {
			param: JSON.stringify(queryParams)
		}
		let params = new URLSearchParams();
		for (let key in options) {
			params.set(key, options[key])
		}
		return this.http.get<QueryResultsModel>(API_ENGINEER_URL + '/list?' + params,{ headers: httpHeaders });
		
	}
	deleteEngineer(engineerId: string) {
		const url = `${API_ENGINEER_URL}/delete/${engineerId}`;
		return this.http.delete(url);
	}
	getEngineerById(id: string): Observable<any>{
		return this.http.get<any>(`${API_ENGINEER_URL}/${id}`);
	}
	updateEngineer(engineer: EngineerModel) {
		const url = `${API_ENGINEER_URL}/edit/${engineer._id}`;
		return this.http.patch(url, engineer);
	}
	createEngineer(engineer: EngineerModel): Observable<EngineerModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<EngineerModel>(`${API_ENGINEER_URL}/add`, engineer, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_ENGINEER_URL_EXPORT}`, "export-engineer.xlsx");
	}
}
