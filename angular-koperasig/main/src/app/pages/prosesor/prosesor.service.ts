import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class ProsesorService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getProsesor(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/prosesor`, { headers });
  }

  getProsesorById(id_prosesor: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/prosesor/${id_prosesor}`, { headers });
  }

  // Buat bikin
  createProsesor(nama_prosesor: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_prosesor', nama_prosesor);
    return this.http.post<any>(`${baseUrl}api/prosesor`, formData, { headers });
  }

  // Buat update
  updateProsesor(id_prosesor: number, nama_prosesor: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/prosesor/${id_prosesor}`;
    return this.http.put<any>(url, { nama_prosesor }, { headers });
  }

  // Buat delete
  deleteProsesor(id_prosesor: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/prosesor/${id_prosesor}`;
    return this.http.delete<any>(url, { headers });
  }
}
