import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
}
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
  getProfile():Observable<UserDto>{
    return this.http.get<UserDto>(`${this.apiUrl}/profile`);
  }
  updateProfile(request: UpdateUserRequest):Observable<UserDto>{
    return this.http.put<UserDto>(`${this.apiUrl}/update`, request);
  }
  changePassword(request: ChangePasswordRequest):Observable<UserDto>{
    return this.http.post<UserDto>(`${this.apiUrl}/change-password`, request);
  }
}
