import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header.component/header.component';
import { LoginComponent } from '../login/login';
import { Register } from '../register/register';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet, LoginComponent, Register],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showLogin = false;
  showRegister = false;
  openLogin() {
    this.showLogin = true;
    this.showRegister = false;
  }

  closeLogin() {
    this.showLogin = false;
  }

  onLoginSuccess() {
    this.showLogin = false;
  }
  
  openRegister() {
    this.showRegister = true;
    this.showLogin = false;
  }
  closeRegister() {
    this.showRegister = false;
  }
  onRegisterSuccess() {
    this.showRegister = false;
  }
  switchLogin() {
    this.showLogin = true;
    this.showRegister = false;
  }
  switchRegister() {
    this.showRegister = true;
    this.showLogin = false;
  }
}
