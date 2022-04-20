import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from "../shared/auth.service";
import { Record } from "./record";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  endpoint: string = `${environment.apiURL}/api`;

  constructor(public authService: AuthService, private http: HttpClient){
  }

  private async request(method: string, url: string, data?: any, responseType?: any){
    const token = this.authService.getToken();

    const result = this.http.request(method, url, {
      body: data,
      responseType: responseType || 'json',
      observe: 'body',
      headers: {
        Authorization: `Token ${token}`
      }
    });
    return new Promise<any>((resolve, reject) => {
      result.subscribe(resolve as any, reject as any);
    });
  }

  getRecords(){
    return this.request('get', `${this.endpoint}/records`);
  }

  getRecord(id: string){
    return this.request('get', `${this.endpoint}/records/${id}`);
  }

  createRecord(record: Record){
    return this.request('post', `${this.endpoint}/records`, record);
  }

  updateRecord(record: Record) {
    return this.request('put', `${this.endpoint}/records/${record.id}`, record);
  }

  deleteRecord(id: string) {
    return this.request('delete', `${this.endpoint}/records/${id}`, null, 'text');
  }

  runLongRunningTask(){
    return this.request('get', `${this.endpoint}/long-running-job`, '', 'text/html');
  }
}
