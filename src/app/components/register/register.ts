import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})


export class Register {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  constructor(private authService: AuthService) {}
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();
  @Output() loginClick = new EventEmitter<void>(); 

  onRegister() {
  this.authService.register({
    username: this.username,
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword
  }).subscribe({
    next: (response) => {
      console.log('Register successful:', response);
      if (response.token) {
        this.authService.saveToken(response.token);
      }
      this.success.emit();
    },
    error: (err) => {
      console.error('Register failed', err);
      this.errorMessage = err.error?.message || 'Đăng ký thất bại';
    }
  });
}
openLogin()
{
  this.loginClick.emit();
}

}
