import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TaskService } from '../../services/tasks.service';
import { HeaderComponent } from '../header.component/header.component';


@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.html',
  imports: [CommonModule, HeaderComponent, RouterOutlet, FormsModule],
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  newTaskTitle: number = 0;
  keyword = '';
  status = '';
 tasksToday: any[] = [];      
  tasksTomorrow: any[] = [];   
  tasksThisWeek: any[] = []; 
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Lỗi load tasks:', err)
    });
  }
  addTask() {
    if (!this.newTaskTitle) return;
    this.taskService.createTask(this.newTaskTitle).subscribe({
      next: () => {
        this.newTaskTitle = 0;
        this.loadTasks();
      },
      error: (err) => console.error(err)
    });
  }
  deleteTask(id : number)
  {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => console.error(err)
    });
  }
  updateTask(id:number)
  {
    this.taskService.updateTasks(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => console.error(err)
    });
    
    }
    updatTaskStatus(status: string)
    
    {
      this.taskService.updateStatus(status).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => console.error(err)
      });
    }
    searchTasks(dueDate?: Date, keyword?: string, status?: string) {
  this.taskService.searchTask(dueDate, keyword, status).subscribe({
    next: (data) => {
      this.tasks = data;

      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const endOfWeek = new Date();
      endOfWeek.setDate(today.getDate() + 7);

      this.tasksToday = this.tasks.filter(t =>
        new Date(t.dueDate).toDateString() === today.toDateString()
      );

      this.tasksTomorrow = this.tasks.filter(t =>
        new Date(t.dueDate).toDateString() === tomorrow.toDateString()
      );

      this.tasksThisWeek = this.tasks.filter(t => {
        const d = new Date(t.dueDate);
        return d > tomorrow && d <= endOfWeek;
      });
    },
    error: (err) => console.error('Lỗi tìm kiếm tasks:', err),
  });
}
}

