import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AdModel } from './ad.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {QueryResultsModel} from '../../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryAdModel } from './queryad.model';

const API_FLOOR_URL = 'http://localhost:3000/api/asset/deprecitiaion';
const API_CSV = 'http://localhost:3000/api/excel/asset/deprecitiaion/export';




@Injectable({
	providedIn: 'root'
})
export class AdService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListAd(queryParams: QueryAdModel): Observable<QueryResultsModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		let parads = new URLSearchParams();
		parads.set("parad", JSON.stringify(queryParams));
		return this.http.get<QueryResultsModel>(API_FLOOR_URL + '?' + parads,{ headers: httpHeaders });
	}

	
	findAdById(_id: string): Observable<AdModel>{
		return this.http.get<AdModel>(`${API_FLOOR_URL}/${_id}`);
	}
	deleteAd(adId: string) {
		const url = `${API_FLOOR_URL}/${adId}`;
		return this.http.delete(url);
	}
	updateAd(ad: AdModel) {
		const url = `${API_FLOOR_URL}/${ad._id}`;
		return this.http.patch(url, ad);
	}

	createAd(ad: AdModel): Observable<AdModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<AdModel>(`${API_FLOOR_URL}/`, ad, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_CSV}`, "export-ad.xlsx");
	}
}
