import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth';
import { UserProfile, UserService } from '../../services/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  isLoggedIn = false;
  currentUser: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;

      if (isLogged) {
        this.userService.getMe().subscribe({
          
          next: (user) => {
  console.log('Fetched user:', user);
  this.currentUser = user;
},
          error: (err) => console.error('Error fetching user data:', err)
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  onLoginClick() {
    this.loginClick.emit();
  }

  onRegister() {
    this.registerClick.emit();
  }

  logout() {
    this.authService.logout();
  }
}
