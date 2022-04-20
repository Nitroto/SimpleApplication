import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router){
  }

  // Sign-up
  signUp(user: User): Subscription{
    let api = `${this.endpoint}/users`;
    return this.http
      .post<any>(api, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.getUserProfile(res.id).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['user-profile/' + res.id]);
        });
      });
  }

  // Sign-in
  signIn(user: User): Subscription{
    let api = `${this.endpoint}/users/authenticate`;
    return this.http
      .post<any>(api, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.getUserProfile(res.id).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['user-profile/' + res.id]);
        });
      });
  }

  getToken(){
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean{
    let authToken = localStorage.getItem('access_token');
    return authToken !== null;
  }

  doLogout(){
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // User profile
  getUserProfile(id: any): Observable<any>{
    let api = `${this.endpoint}/users/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse){
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => msg);
  }
}
