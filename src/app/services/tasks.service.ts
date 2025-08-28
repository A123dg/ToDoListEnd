import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl='http://localhost:5085/api/tasks';

  constructor(private httpClient: HttpClient) {}

  getAllTasks():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }

  getTasks(status?: string, keyword?: string):Observable<any>
  {
    const param:any={};
    if(status) param.status = status;   // sửa chỗ null check
    if(keyword) param.keyword = keyword;
    return this.httpClient.get<any[]>(this.apiUrl,{params:param});
  }

  createTask(id: number):Observable<any>
  {
    return this.httpClient.post<any>(`${this.apiUrl}`, {id});
  }

  deleteTask(id: number):Observable<any>
  {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateStatus(status: string):Observable<any>
  {
    return this.httpClient.patch<any>(`${this.apiUrl}`, {status});
  }

  updateTasks(id:number):Observable<any>
  {
    return this.httpClient.put<any>(`${this.apiUrl}/${id}`, {id});
  }

   searchTask(dueDate?: Date, keyword?: string, status?: string): Observable<any[]> {
    let params = new HttpParams();

    if (dueDate) {
      params = params.set('dueDate', dueDate.toISOString()); 
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.httpClient.get<any[]>(`${this.apiUrl}/search`, { params });
  }
}

