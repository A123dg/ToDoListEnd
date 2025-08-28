import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5085/api/auth';
  
  private loggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }
register(data: { username: string; email?: string; password: string; confirmPassword: string }): Observable<any> {
  return this.httpClient.post<any>(`${this.apiUrl}/register`, data);
}

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
        this.loggedInSubject.next(false); 

  }
}
