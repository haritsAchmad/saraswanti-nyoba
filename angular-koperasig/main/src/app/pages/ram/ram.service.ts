import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://127.0.0.1:8000/';
const token = localStorage.getItem('token');
@Injectable({
  providedIn: 'root'
})
export class RamService {

  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Buat getter
  getRam(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${baseUrl}api/ram`, { headers });
  }

  getRamById(id_ram: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${baseUrl}api/ram/${id_ram}`, { headers });
  }

  // Buat bikin
  createRam(nama_ram: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nama_ram', nama_ram);
    return this.http.post<any>(`${baseUrl}api/ram`, formData, { headers });
  }

  // Buat update
  updateRam(id_ram: number, nama_ram: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/ram/${id_ram}`;
    return this.http.put<any>(url, { nama_ram }, { headers });
  }

  // Buat delete
  deleteRam(id_ram: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${baseUrl}api/ram/${id_ram}`;
    return this.http.delete<any>(url, { headers });
  }
}
