import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, filter} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from './member-details/member-details.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) {}

  // Returns all members
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  getMemberById(id: number): Observable<Member> {
      return this.http
          .get(`${this.api}/members/${id}`)
          .pipe(catchError(this.handleError));
  }

  setMemberById(id: number, member: Member): Observable<any> {
    return this.http
        .put(`${this.api}/members/${id}`, member, {observe: 'response', responseType: 'json'})
        .pipe(catchError(this.handleError));
  }

  setUsername(name: string): void {
    this.username = name;
  }

  addMember(member: Member): Observable<any> {
    return this.http
        .post<any>(`${this.api}/members`, member, {observe: 'response', responseType: 'json'})
        .pipe(catchError(this.handleError));
  }

  getTeams(): Observable<any> {
    return this.http
        .get(`${this.api}/teams`)
        .pipe(
            catchError(this.handleError),
            // TODO: filter for only the appropriate shape
        );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
