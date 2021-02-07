import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly BASE_URL: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }
  
    basicGet(): Observable<any> {
      return this.http.get<any>(this.BASE_URL).pipe(catchError(this.handleError<any>('basicGet')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
      return (error: Error): Observable<T> => {
          return of(result as T);
      };
  }
  
}
