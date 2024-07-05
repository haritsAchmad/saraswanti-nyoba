import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const baseUrl = 'http://127.0.0.1:8000/';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}api/inventory`, { headers: this.getHeaders() });
  }

  getInventoryById(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}api/inventory/${id}`, { headers: this.getHeaders() });
  }

  createInventory(data: any): Observable<any> {
    const formData: FormData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return this.http.post<any>(`${baseUrl}api/inventory`, formData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateInventory(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}api/inventory/${id}`, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteInventory(id: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}api/inventory/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getHighestId(): Observable<number> {
    return this.http.get<number>(`${baseUrl}api/inventory/highest-id`, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
