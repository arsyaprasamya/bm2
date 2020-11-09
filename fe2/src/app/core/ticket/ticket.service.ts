import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TicketModel } from './ticket.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {QueryResultsModel} from '../_base/crud';

import * as FileSaver from 'file-saver';
import { QueryTicketModel } from './queryticket.model';

const API_FLOOR_URL = 'http://localhost:3000/api/ticket';
const API_CSV = 'http://localhost:3000/api/excel/ticket/export';




@Injectable({
	providedIn: 'root'
})
export class TicketService {
	constructor(private http: HttpClient) {}
	// get list block group
	getListTicket(queryParams: QueryTicketModel): Observable<QueryResultsModel>{
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
		return this.http.get<QueryResultsModel>(API_FLOOR_URL + '/?' + params,{ headers: httpHeaders });
	}

	generateTicketCode(): Observable<QueryResultsModel>{
		const url = `${API_FLOOR_URL}/generateTicketCode`;
		return this.http.get<QueryResultsModel>(url);
	}

	
	findTicketById(_id: string): Observable<TicketModel>{
		return this.http.get<TicketModel>(`${API_FLOOR_URL}/${_id}`);
	}
	deleteTicket(ticketId: string) {
		const url = `${API_FLOOR_URL}/${ticketId}`;
		return this.http.delete(url);
	}
	updateTicket(ticket: TicketModel) {
		const url = `${API_FLOOR_URL}/${ticket._id}`;
		return this.http.patch(url, ticket);
	}
	createTicket(ticket: TicketModel): Observable<TicketModel>{
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<TicketModel>(`${API_FLOOR_URL}`, ticket, { headers: httpHeaders});
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
		return FileSaver.saveAs(`${API_CSV}`, "export-ticket.xlsx");
	}
}
