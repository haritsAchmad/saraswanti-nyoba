import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getSeries(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/series`, { headers });
  }

  getSeriesById(id_series: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/series/${id_series}`, { headers });
  }

  // Buat bikin
  createSeries(nama_series: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_series', nama_series);
    return this.http.post<any>(`${baseUrl}api/series`, formData, { headers });
  }

  // Buat update
  updateSeries(id_series: number, nama_series: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/series/${id_series}`;
    return this.http.put<any>(url, { nama_series }, { headers });
  }

  // Buat delete
  deleteSeries(id_series: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/series/${id_series}`;
    return this.http.delete<any>(url, { headers });
  }
}
