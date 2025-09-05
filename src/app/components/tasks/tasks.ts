import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TaskService, TaskItem, TaskCreateDto, TaskUpdateDto } from '../../services/tasks.service';
import { HeaderComponent } from '../header.component/header.component';
import { LoginComponent } from '../login/login';
import { Register } from '../register/register';
@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.html',
  imports: [CommonModule, HeaderComponent, RouterOutlet, ReactiveFormsModule, FormsModule, LoginComponent, Register],
  styleUrls: ['./tasks.css']
})

export class TasksComponent implements OnInit {
  tasks: TaskItem[] = [];
  keyword = '';
  status = 0;
  selectedStatus = '';
  selectedDate: string = '';
  sidebarOpen = true;
  tasksToday: TaskItem[] = [];      
  tasksTomorrow: TaskItem[] = [];   
  tasksThisWeek: TaskItem[] = []; 

  showEditModal = false;
  editingTask: TaskItem | null = null;

  taskForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: ['', Validators.required],
      status: ['PENDING', Validators.required]
    });

    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: ['', Validators.required],
      status: ['PENDING', Validators.required]
    });
  }

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
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      
             const statusMap: { [key: string]: number } = {
         'PENDING': 0,
         'DONE': 2
       };
      
      const statusValue = statusMap[formValue.status];
      if (statusValue === undefined) {
        console.error('Invalid status value:', formValue.status);
        
        return;
      }

      const payload: TaskCreateDto = {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || undefined,
        dueDate: new Date(formValue.dueDate).toISOString(),
        status: statusValue
      };
      
      console.log('Form value:', formValue);
      console.log('Sending payload:', payload); 
      console.log('Payload JSON:', JSON.stringify(payload));
      
      this.taskService.createTask(payload).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.taskForm.reset({ status: 'PENDING' });
          this.loadTasks();
        },
        error: (err) => {
          console.error('Create task error:', err);
          console.error('Error status:', err.status);
          console.error('Error details:', err.error);
          console.error('Validation errors:', err.error?.errors); 
          console.error('Full error response:', JSON.stringify(err.error, null, 2));
          console.error('Request payload that was sent:', payload);
          console.error('Request payload JSON:', JSON.stringify(payload, null, 2));
        
          if (typeof err.error === 'string') {
            alert(err.error); 
          }
          else if (err.error && err.error.errors) {
            for (const key in err.error.errors) {
              if (err.error.errors.hasOwnProperty(key)) {
                alert(err.error.errors[key]);
              }
            }
          }
          else {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
          }
        }
      });
    } else {
      console.error('Form is invalid:', this.taskForm.errors);
      console.error('Form value:', this.taskForm.value);
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => console.error(err)
    });
  }

  openEditModal(task: TaskItem) {
    this.editingTask = task;
    
    
         const statusMap: { [key: number]: string } = {
       0: 'PENDING',
       2: 'DONE', 
     };
    
    const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
    
    this.editForm.patchValue({
      title: task.title,
      description: task.description || '',
      dueDate: dueDate,
             status: task.status || 'PENDING'
    });
    
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingTask = null;
    this.editForm.reset();
  }

  
  updateTask() {
    if (this.editForm.valid && this.editingTask) {
      const formValue = this.editForm.value;
      
             const statusMap: { [key: string]: number } = {
         'PENDING': 0,
         'DONE': 2
       };
      
      const payload: TaskUpdateDto = {
        title: formValue.title,
        description: formValue.description || undefined,
        dueDate: new Date(formValue.dueDate).toISOString(),
        status: statusMap[formValue.status] || 0
      };
      
      this.taskService.updateTask(this.editingTask.id!, payload).subscribe({
        next: (response) => {
          console.log('Update success:', response);
          this.closeEditModal();
          this.loadTasks();
        },
        error: (err) => {
          console.error('Update task error:', err);
        }
      });
    }
  }

  toggleTaskStatus(task: TaskItem) {
    if (!task.id) return;
    
    const oldStatus = task.status;
    const newStatus = task.status === 'DONE' ? 'PENDING' : 'DONE';
    task.status = newStatus;
  
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        console.log("Status updated successfully");
      },
      error: (err: any) => {
        console.error(err);
        task.status = oldStatus;
      }
    });
  }

  applyFilter() {
    const st = this.selectedStatus || undefined;
    const kw = this.keyword || undefined;
    const dd = this.selectedDate ? new Date(this.selectedDate) : undefined;
    this.searchTasks(dd, kw, st);
  }

  searchTasks(dueDate?: Date, keyword?: string, status?: string) {
    this.taskService.searchTasks(dueDate, keyword, status).subscribe({
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

 
