import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const baseUrl = 'http://127.0.0.1:8000/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getCrsfToken() {
    return this.http.get<any>(`${baseUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
      observe: 'response',
    });
  }

  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', username);
    formData.append('password', password);

    return this.http.post<any>(`${baseUrl}api/login`, formData).pipe(
      tap((response) => {
        // Check if login was successful
        if (response && response.access_token) {
          // Store token in localStorage
          localStorage.setItem('token', response.access_token);
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`${baseUrl}api/logout`, {}, { headers }).pipe(
      tap(() => {
        // Clear token from localStorage
        localStorage.removeItem('token');
      })
    );
  }

  register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    return this.http.post<any>(`${baseUrl}api/register`, formData);
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/api/user`, { withCredentials: true });
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
