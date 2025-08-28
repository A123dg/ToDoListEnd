import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserProfile {
  username:string;
  role:string;
  email?:string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5085/api/users';
  constructor(private http: HttpClient ) { }
  getMe():Observable<UserProfile>{
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }
}
