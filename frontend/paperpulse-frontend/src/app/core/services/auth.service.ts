import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/users';
  constructor(private httpClient: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/register/`, data);
  }

  refreshToken(): Observable<string> {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.httpClient
      .post<any>('http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/token/refresh/', { refresh })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.access); // update access token
        }),
        map((res) => res.access),
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.httpClient
      .post('http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/token/', credentials)
      .pipe(
        tap((res: any) => {
          localStorage.setItem('token', res.access);
          localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('user', JSON.stringify(res.user));
        }),
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.is_staff || user.is_superuser;
  }

  getFullName(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return `${user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) || ''} ${user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1) || ''}`.trim();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
