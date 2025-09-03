import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TaskItem {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  status: string;
  ownerId?: string;
}

export interface TaskCreateDto {
  id?: number;
  title: string;
  description?: string;
  dueDate: string; 
  status: number; 
  ownerId?: string;
}

export interface TaskUpdateDto {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  status: number;
  ownerId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5085/api/tasks';

  constructor(private httpClient: HttpClient) {}

  getAllTasks(): Observable<TaskItem[]> {
    return this.httpClient.get<TaskItem[]>(`${this.apiUrl}/all`);
  }

  getTasks(status?: string, keyword?: string): Observable<TaskItem[]> {
    const params: any = {};
    if (status) params.status = status;
    if (keyword) params.keyword = keyword;
    return this.httpClient.get<TaskItem[]>(this.apiUrl, { params });
  }

  getTaskById(id: number): Observable<TaskItem> {
    return this.httpClient.get<TaskItem>(`${this.apiUrl}/${id}`);
  }

  createTask(task: TaskCreateDto): Observable<TaskItem> {
    return this.httpClient.post<TaskItem>(`${this.apiUrl}`, task);
  }

  updateTask(id: number, task: TaskUpdateDto): Observable<TaskItem> {
    return this.httpClient.put<TaskItem>(`${this.apiUrl}/${id}`, task);
  }

  updateTaskStatus(id: number, status: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/status`;
    return this.httpClient.patch(url, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as 'json'
    });
  }
  
  
  

  deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchTasks(dueDate?: Date, keyword?: string, status?: string): Observable<TaskItem[]> {
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

    return this.httpClient.get<TaskItem[]>(`${this.apiUrl}/search`, { params });
  }
}

