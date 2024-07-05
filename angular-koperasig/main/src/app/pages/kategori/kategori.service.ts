import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class KategoriService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getKategori(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/kategori`, { headers });
  }

  getKategoriById(id_kategori: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/kategori/${id_kategori}`, { headers });
  }

  // Buat bikin
  createKategori(nama_kategori: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_kategori', nama_kategori);
    return this.http.post<any>(`${baseUrl}api/kategori`, formData, { headers });
  }

  // Buat update
  updateKategori(id_kategori: number, nama_kategori: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/kategori/${id_kategori}`;
    return this.http.put<any>(url, { nama_kategori }, { headers });
  }

  // Buat delete
  deleteKategori(id_kategori: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/kategori/${id_kategori}`;
    return this.http.delete<any>(url, { headers });
  }
}
