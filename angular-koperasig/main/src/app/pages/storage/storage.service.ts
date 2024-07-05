import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getStorage(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/storage`, { headers });
  }

  getStorageById(id_storage: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/storage/${id_storage}`, { headers });
  }

  // Buat bikin
  createStorage(nama_storage: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_storage', nama_storage);
    return this.http.post<any>(`${baseUrl}api/storage`, formData, { headers });
  }

  // Buat update
  updateStorage(id_storage: number, nama_storage: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/storage/${id_storage}`;
    return this.http.put<any>(url, { nama_storage }, { headers });
  }

  // Buat delete
  deleteStorage(id_storage: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/storage/${id_storage}`;
    return this.http.delete<any>(url, { headers });
  }
}
