import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

 @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();  constructor(private authService: AuthService, private router: Router) {}
    @Output() registerClick = new EventEmitter<void>(); 

  onLogin() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveToken(response.token);
        window.location.reload();
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Sai tài khoản hoặc mật khẩu';
      }
    });
  }
   openRegister() {
    this.registerClick.emit();
  }
}
