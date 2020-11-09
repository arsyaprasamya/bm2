import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
const API_BLOCK_URL = 'http://localhost:3000/api/block';

@Injectable({
  providedIn: 'root'
})
export class ExportProjectService {

  constructor(private http: HttpClient) { }
	getExcel(request, fileName)
	{
	}
}
