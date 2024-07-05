import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class LokasiService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getLokasi(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/lokasi`, { headers });
  }

  getLokasiById(id_lokasi: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/lokasi/${id_lokasi}`, { headers });
  }

  // Buat bikin
  createLokasi(nama_lokasi: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_lokasi', nama_lokasi);
    return this.http.post<any>(`${baseUrl}api/lokasi`, formData, { headers });
  }

  // Buat update
  updateLokasi(id_lokasi: number, nama_lokasi: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/lokasi/${id_lokasi}`;
    return this.http.put<any>(url, { nama_lokasi }, { headers });
  }

  // Buat delete
  deleteLokasi(id_lokasi: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/lokasi/${id_lokasi}`;
    return this.http.delete<any>(url, { headers });
  }
}
