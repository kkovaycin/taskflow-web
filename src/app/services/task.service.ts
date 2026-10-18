import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import type { ITask, ICreateTask, UpdateTask } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly tasksUrl = `${environment.apiUrl}/tasks`;

  getAllTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.tasksUrl);
  }

  getTaskById(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.tasksUrl}/${id}`);
  }

  createTask(data: ICreateTask): Observable<ITask> {
    return this.http.post<ITask>(this.tasksUrl, data);
  }

  updateTask(id: string, data: UpdateTask): Observable<ITask> {
    return this.http.patch<ITask>(`${this.tasksUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.tasksUrl}/${id}`);
  }
}
