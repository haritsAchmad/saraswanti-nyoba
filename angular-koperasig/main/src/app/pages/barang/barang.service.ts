import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const baseUrl = 'http://127.0.0.1:8000/';

@Injectable({
  providedIn: 'root'
})
export class BarangService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBarang(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}api/barang`, { headers: this.getHeaders() });
  }

  getBarangById(id_barang: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}api/barang/${id_barang}`, { headers: this.getHeaders() });
  }

  createBarang(data: any): Observable<any> {
    const formData: FormData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return this.http.post<any>(`${baseUrl}api/barang`, formData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateBarang(id_barang: number, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}api/barang/${id_barang}`, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteBarang(id: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}api/barang/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getHighestId(): Observable<number> {
    return this.http.get<number>(`${baseUrl}api/barang/highest-id`, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
