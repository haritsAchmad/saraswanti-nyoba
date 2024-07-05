import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class MerkService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getMerk(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/merk`, { headers });
  }

  getMerkById(id_merk: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/merk/${id_merk}`, { headers });
  }

  // Buat bikin
  createMerk(nama_merk: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_merk', nama_merk);
    return this.http.post<any>(`${baseUrl}api/merk`, formData, { headers });
  }

  // Buat update
  updateMerk(id_merk: number, nama_merk: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/merk/${id_merk}`;
    return this.http.put<any>(url, { nama_merk }, { headers });
  }

  // Buat delete
  deleteMerk(id_merk: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/merk/${id_merk}`;
    return this.http.delete<any>(url, { headers });
  }
}
