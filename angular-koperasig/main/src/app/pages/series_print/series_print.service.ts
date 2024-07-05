import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class Series_printService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getSeries_print(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/series_print`, { headers });
  }

  getSeries_printById(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/series_print/${id}`, { headers });
  }

  // Buat bikin
  createSeries_print(nama_series_print: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_series_print', nama_series_print);
    return this.http.post<any>(`${baseUrl}api/series_print`, formData, { headers });
  }

  // Buat update
  updateSeries_print(id: number, nama_series_print: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/series_print/${id}`;
    return this.http.put<any>(url, { nama_series_print }, { headers });
  }

  // Buat delete
  deleteSeries_print(id: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/series_print/${id}`;
    return this.http.delete<any>(url, { headers });
  }
}
